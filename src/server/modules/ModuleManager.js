var _ = require("lodash");
var modules = {
	"music": {
		"path": "music"
	},
	"spotify": {
		"require": [{module: "music", version: "0.1"}]
	}
}
/*

	"music_p1": {
		"path": "music/p1"
	}
 
,
	"music_p2": {
		"path": "music/p2",
		"require": "music",
		"links": [{module: "music", version: "0.1"}]
	},
	"alarm": {
		"require": [{module: "music", version: "0.1"}]
	}
 */

var setModule = function(module, moduleName) {
	if(module.module) {
		return true;
	}
	if(module.error) {
		return false;
	}
	try {
		checkConfig(module, moduleName);
		var mod = require("./" + moduleName);
		if (typeof mod.link === "function") {
			mod.link();
		}
		module.module = mod;
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
		_.forEach(modules, function(module, key) {
			setModule(module, key);
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