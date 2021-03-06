var express = require('express');
var _ = require("lodash");
var modulesManager = require(__base + "modules/ModuleManager");

module.exports = function(app, router) {

	var router = express.Router();
	_.forEach(modulesManager.getAll(), function(module, key) {
		console.log(module.path)
		if (module.path && module.module && typeof module.module.routes === "function") {
			var modRouter = module.module.routes(app, express.Router());
			console.log("settings routes /api/modules/" + module.path + "/*");
			router.use("/" + module.path, modRouter);
		} else {
			console.log(JSON.stringify(module.module, null, 2));
		}
	});
	router.use("/", function(req, res) {
		res.json({status: "error", "error": "TODO: Route"});
	});
	app.use("/api/modules", router);
};