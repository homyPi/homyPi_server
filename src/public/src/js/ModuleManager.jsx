import $ from "jquery";
import config from "./config"
let modulesList = [];

let modules = [];
class ModuleManager {

	static loadModules() {
		ModuleManager.modules = require("./modules.js");
		console.log("modules = ", ModuleManager.modules);
		ModuleManager.modules.forEach(function(module) {
			if (module.footer) {
				ModuleManager.footers.push(module.footer);
			}
		})
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