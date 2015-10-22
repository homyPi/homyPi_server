var _ = require("lodash");
var modulesNames = require("../data/public/config").modules || [];
var modules = {};
_.forEach(modulesNames, function(m) {
	modules[m] = require(m+ "/server/config");
});

var setModule = function(module, moduleName) {
	if(module.module) {
		return true;
	}
	if(module.error) {
		return false;
	}
	try {
		checkConfig(module, moduleName);
		var mod = require(moduleName + "/server");
		if (typeof mod.link === "function") {
			mod.link(this);
		}
		module.module = mod;
		console.log(moduleName + " loaded");
	} catch(e) {
		console.log(e);
		module = {error: e};
		return false;
	}
}

var hasRequirement = function(require) {
	return require.every(function(moduleInfo) {
		if(!modules[moduleInfo.module]) {
			return false;
		}
		return setModule(modules[moduleInfo.module],
			moduleInfo.module);
	});
}
var checkConfig = function(module, name) {
	if(module.require) {
		if(!hasRequirement(module.require)) {
			return false;
		}
	}
	return true;
}
module.exports = {
	load: function() {
		console.log("Loading modules");
		_.forEach(modules, function(module, key) {
			console.log("setting module: " + key);
			setModule(module, key);
		});
	},
	setUpSocket: function(socket) {
		_.forEach(modules, function(module, key) {
			if(module.module && typeof module.module.setSocket === "function") {
				console.log("setting socket for " + key);
				module.module.setSocket(socket);
			}
		});
	},
	get: function(moduleName) {
		if (modules[moduleName] && modules[moduleName].module) {
			return modules[moduleName].module;
		}
		var err = new Error("Cannot find module '" + moduleName + "'");
		err.code = 'MODULE_NOT_FOUND';
		throw err;
	},
	getAll: function() {
		return modules;
	}
}