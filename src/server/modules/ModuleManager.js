var _ = require("lodash");
var Promise = require("bluebird");
var Toposort = require('toposort-class'),
    t = new Toposort();
var ServicesManager = require("./ServicesManager");
var config = require("../data/private/config");


ModuleManager = function() {};

ModuleManager.Raspberry;
ModuleManager.UserMiddleware;
ModuleManager.MongooseModels;

ModuleManager.modulesNames = [];
ModuleManager.modules = {};
ModuleManager.order = [];

ModuleManager.init = function(names, mods) {
	ModuleManager.modulesNames = names;
	if (!ModuleManager.modulesNames) {
		ModuleManager.modulesNames = [];
		var modList = require("../data/public/config").modules
		for (var m in modList) {
			ModuleManager.modulesNames.push(m);
		}
	}

	ModuleManager.modules = mods || {};
	ModuleManager._setOrder();
}
ModuleManager.get = function(moduleName) {
	if (ModuleManager.modules[moduleName] && ModuleManager.modules[moduleName].module) {
		return ModuleManager.modules[moduleName].module;
	}
	var err = new Error("Cannot find module '" + moduleName + "'");
	err.code = 'MODULE_NOT_FOUND';
	throw err;
}
ModuleManager._setOrder = function() {
	_.forEach(ModuleManager.modulesNames, function(m) {
		var mGraph = [];
		if (!ModuleManager.modules[m])
			ModuleManager.modules[m] = require(m+ "/server/config");
		if(ModuleManager.modules[m].require) {
			ModuleManager.modules[m].require.every(function(dep) {
				mGraph.push(dep.module);
			});
		}
		t.add(m, mGraph);
	});
	ModuleManager.order = t.sort().reverse();
}
ModuleManager._setModule = function(module, moduleName) {
	return new Promise(function(resolve, reject) {
		if(module.error) {
			return reject(module.error)
		}
		
		try {
			console.log("Setting up " + moduleName);
			//checkConfig(module, moduleName);
			if (!module.module) {
				var mod = require(moduleName + "/server");
				module.module = mod;
			}
			if (typeof module.module.link === "function") {
				module.module.link(ModuleManager, Raspberry, MongooseModels, UserMiddleware, config);
			}
			console.log(moduleName + " LOADED");
			if(typeof module.getServices === "function") {
				ServicesManager.addServices(module.getServices());
			}
			if(typeof module.module.init === "function") {
				return module.module.init().then(resolve).catch(reject);
			} else {
				return resolve();
			}
		} catch(e) {
			console.log(e);
			console.log(e.stack);
			module = {error: e};
			return reject();
		}
	});
}
ModuleManager.executePromiseSorted = function(fn, i) {
	return new Promise(function(resolve, reject) {
		if (!ModuleManager.order.length || typeof fn != "function") return resolve();

		if(typeof i === "undefined") {
			i = 0;
		}
		var modName = ModuleManager.order[i];
		console.log("execute promise for " + modName + "("+i+")");
		fn(ModuleManager.modules[modName], modName)
			.then(function() {
				i++;
				if(i < ModuleManager.order.length) {
					ModuleManager.executePromiseSorted(fn, i)
						.then(resolve)
						.catch(reject);
				} else {
					resolve();
				}
			}).catch(reject);
	});
}
ModuleManager.executeSorted = function(fn) {
	if(typeof fn != "function") return;
	for(var i = 0; i < ModuleManager.order.length; i++) {
		console.log(ModuleManager.order[i]);
		if (ModuleManager.modules[ModuleManager.order[i]]) {
			fn(ModuleManager.modules[ModuleManager.order[i]], ModuleManager.order[i]);
		}
	}
};
ModuleManager.load = function() {
		return new Promise(function(resolve, reject) {
			console.log("Loading modules");
			Raspberry = require("../models/Raspberry");
			UserMiddleware = require("../middleware/user");
			MongooseModels = require("../models/mongoose/mongoose-models");
			ModuleManager.executePromiseSorted(ModuleManager._setModule)
				.then(resolve)
				.catch(reject);
		});
		//executeSorted(setModule);
	};
ModuleManager.setUpSocket = function(socket, io) {
		_.forEach(ModuleManager.modules, function(module, key) {
			if(module.module && typeof module.module.setSocket === "function") {
				console.log("setting socket for " + key);
				module.module.setSocket(socket, io);
			}
		});
	};
ModuleManager.getAll = function() {
		return ModuleManager.modules;
	};
module.exports = ModuleManager