import $ from "jquery";
import config from "./config"

import RaspberryActionCreators from "./actions/RaspberryActionCreators.jsx";
import RaspberryStore from "./stores/RaspberryStore.jsx";

let modulesList = [];

let modules = [];

let modulesListeners = {};
let raspberryListeners = [];

let RASPBERRY_EVENTS = {
    NEW: "NEW",
    DISCONNECTED: "DISCONNECTED",
    SELECTED_CHANGED: "SELECTED_CHANGED"
};
let MODULES_EVENTS = {
    UP: "UP",
	DOWN: "DOWN"
};


var ModuleManager = {}
ModuleManager.getEvents = function() {
	return {
		RASPBERRY_EVENTS: ModuleManager.RASPBERRY_EVENTS,
		MODULES_EVENTS: ModuleManager.MODULES_EVENTS
	}
}

ModuleManager.watchModules = function(moduleName, callback) {
		if (!modulesListeners[moduleName]) {
			modulesListeners[moduleName] = [];
		}
		modulesListeners[moduleName].push(callback);
	}

ModuleManager.notifyModuleEvent = function(moduleName, event, data) {
		if (!modulesListeners[moduleName]) return;
		for (let callback of modulesListeners[moduleName]) {
			callback(event, data);
		}
	}
	ModuleManager.watchRaspberry = function(callback) {
		raspberryListeners.push(callback);
	}
	ModuleManager.notifyRaspberryEvent = function(moduleName, event, data) {
		for (let callback of raspberryListeners) {
			callback(event, data);
		}
	}
	ModuleManager.loadModules = function() {
		ModuleManager.modules = require("./modules.js");
		console.log("checking links");
		ModuleManager.modules.forEach(function(module) {
			if (typeof module.link === "function") {
				console.log("linking ", module);
				module.link({
					watchModules: ModuleManager.watchModules,
					watchRaspberry: ModuleManager.watchRaspberry,
					RASPBERRY_EVENTS: RASPBERRY_EVENTS,
					MODULES_EVENTS: MODULES_EVENTS,
					getRaspberries: RaspberryStore.getAll
				});
			}
			if (module.footer) {
				ModuleManager.footers.push(module.footer);
			}
		})
	}

	ModuleManager.setSocket = function(io) {
		ModuleManager.modules.forEach(function(module) {
			if (typeof module.setSocket === "function") {
				module.setSocket(io);
			}
		});
	}

	ModuleManager.getFooter = function() {
		console.log(ModuleManager.footers);
		if (ModuleManager.footers.length) {
			return ModuleManager.footers[0];
		} else {
			return "";
		}
	}


ModuleManager.modules = [];
ModuleManager.footers = [];

ModuleManager.RASPBERRY_EVENTS = RASPBERRY_EVENTS;
ModuleManager.MODULES_EVENTS = MODULES_EVENTS;

export default ModuleManager;