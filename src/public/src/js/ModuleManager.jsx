import $ from "jquery";
import config from "./config"

import RaspberryActionCreators from "./actions/RaspberryActionCreators.jsx";
import RaspberryStore from "./stores/RaspberryStore.jsx";

let modulesList = [];

let modules = [];
class ModuleManager {

	static loadModules() {
		ModuleManager.modules = require("./modules.js");
		console.log("checking links");
		ModuleManager.modules.forEach(function(module) {
			if (typeof module.link === "function") {
				console.log("linking ", module);
				module.link({
					addChangeListenerRaspberry: (fun) => {RaspberryStore.addChangeListener(fun)},
					rasbperryStoreGetAll: RaspberryStore.getAll
				});
			}
			if (module.footer) {
				ModuleManager.footers.push(module.footer);
			}
		})
	}

	static setSocket(io) {
		ModuleManager.modules.forEach(function(module) {
			if (typeof module.setSocket === "function") {
				module.setSocket(io);
			}
		});
	}

	static getFooter() {
		console.log(ModuleManager.footers);
		if (ModuleManager.footers.length) {
			return ModuleManager.footers[0];
		} else {
			return "";
		}
	}

}
ModuleManager.modules = [];
ModuleManager.footers = [];

export default ModuleManager;