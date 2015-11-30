global.__base  = "../../src/server/";
var ModuleManager = require(__base + "modules/ModuleManager");
var Promise = require("bluebird");

var TestTool = function(configs) {
	this.modulesNames = [];
	this.modules = {};
	this.ModuleManager = ModuleManager;
	this.configs = configs;
	
	this.addModule(name, config, module) {
		this.modulesNames.push(name);
		this.modules[name] = config;
		this.modules[name].module = module;
	}

	this.start = function() {
		return new Promise(function(resolve, reject) {
			this.ModuleManager.init(this.modulesNames, this.modules);
			this.schema = require(__base + 'models/mongoose/mongoose-schema.js')(this.ModuleManager);
			this.models = require(__base + 'models/mongoose/mongoose-models.js');
			this.connection = require(__base + 'models/mongoose/mongoose-connection')(this.configs, function(err) {
				if (err) {
					reject(err);
				} else {
					this.ModuleManager.load()
						.then(resolve)
				}
			});
		}.bind(this));
	}
};

module.exports = TestTool;