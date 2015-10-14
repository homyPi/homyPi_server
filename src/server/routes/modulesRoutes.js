var express = require('express');
var _ = require("lodash");
var modulesManager = require(__base + "modules/ModuleManager");

module.exports = function(app, router) {

	var router = express.Router();
	_.forEach(modulesManager.getAll(), function(module, key) {
		console.log(module.path)
		if (module.path && typeof module.module.routes === "function") {
			var modRouter = module.module.routes(app, express.Router());
			router.use("/" + module.path, modRouter);
		}
	});
	router.use("/", function(req, res) {
		res.json(modulesManager.modules);
	});
	app.use("/api/modules", router);
};