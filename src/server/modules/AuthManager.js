var ModuleManager = require("./ModuleManager.js");
var _ = require("lodash");

var ServiceManager = function() {};
ServiceManager.services = [];

var setService = function(service) {
	if(!service.auth || !service.name) {
		return null;
	}
	if(service.auth.type == "oauth") {
		if(typeof service.auth.login === "function" &&
			typeof service.auth.loginCallback === "function") {
			return service;
		}
	}
	return null;
}
var getService = function(serviceName) {
	var service;
	for(var i = 0; i < ServiceManager.services.length; i++) {
		if(ServiceManager.services[i].name === serviceName) {
			service = ServiceManager.services[i];
			break;
		}
	}
	return service;
}

module.exports = {
	addServices: function(services) {
		_.forEach(services, function(service) {
			var s = setService(service);
			if(s) {
				ServiceManager.services.push(s);
			}
		});
	},
	login: function(req, res) {
		var service = getService(req.params.name);
		if(!service) {
			return res.json({err: "unknown service"});
		}
		if(service.auth.login) {
			service.auth.login(req, res);
		} else {
			res.json({err: "unknown login function"});
		}
	},
	loginCallback: function(req, res) {
		var service = getService(req.params.name);
		if(!service) {
			return res.json({err: "unknown service"});
		}
		if(service.auth.loginCallback) {
			service.auth.loginCallback(req, res);
		} else {
			res.json({err: "unknown loginCallback function"});
		}
	},
	getServices: function() {
		return ServiceManager.services;
	}
}