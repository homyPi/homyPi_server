var _ = require("lodash");
var Toposort = require('toposort-class'),
    t = new Toposort();
var modulesNames = require("../data/public/config").modules || [];
var ServicesManager = require("./ServicesManager");
var modules = {};
var order = [];

var Raspberry;
var UserMiddleware;
var MongooseModels;

var config = require("../data/private/config");

_.forEach(modulesNames, function(m) {
	var mGraph = [];
	modules[m] = require(m+ "/server/config");
	if(modules[m].require) {
		modules[m].require.every(function(dep) {
			mGraph.push(dep.module);
		});
	}
	t.add(m, mGraph);
});
order = t.sort().reverse();
ModuleManager = function() {};
ModuleManager.get = function(moduleName) {
	if (modules[moduleName] && modules[moduleName].module) {
		return modules[moduleName].module;
	}
	var err = new Error("Cannot find module '" + moduleName + "'");
	err.code = 'MODULE_NOT_FOUND';
	throw err;
}

var setModule = function(module, moduleName) {
	if(module.module) {
		return true;
	}
	if(module.error) {
		return false;
	}
	
	try {
		
		console.log("hey");
		//checkConfig(module, moduleName);
		var mod = require(moduleName + "/server");
		if (typeof mod.link === "function") {
			mod.link(ModuleManager, Raspberry, MongooseModels, UserMiddleware, config);
		}
		if(typeof module.getServices === "function") {
			ServicesManager.addServices(module.getServices());
		}
		module.module = mod;
	} catch(e) {
		console.log(e);
		console.log(e.stack);
		module = {error: e};
		return false;
	}
}

var executeSorted = function(fn) {
		for(var i = 0; i < order.length; i++) {
			console.log(order[i]);
			fn(modules[order[i]], order[i]);
		}
	}
module.exports = {
	load: function() {
		Raspberry = require("../models/Raspberry");
		UserMiddleware = require("../middleware/user");
		MongooseModels = require("../models/mongoose/mongoose-models");

		executeSorted(setModule);
	},
	setUpSocket: function(socket) {
		_.forEach(modules, function(module, key) {
			if(module.module && typeof module.module.setSocket === "function") {
				console.log("setting socket for " + key);
				module.module.setSocket(socket);
			}
		});
	},
	get: ModuleManager.get,
	getAll: function() {
		return modules;
	},
	executeSorted: executeSorted
}