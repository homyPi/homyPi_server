import $ from "jquery";
import config from "./config"
let modulesList = [];

let modules = [];

class ModuleManager {

	static loadModules() {
		ModuleManager.modules = require("./modules.js");
		console.log("modules = ", ModuleManager.modules);
	}
}
ModuleManager.modules = [];

export default ModuleManager;