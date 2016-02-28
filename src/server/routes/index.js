var userRoutes = require("./userRoutes");
//var gracenoteRoutes = require("./gracenoteRoutes");
var raspberryRoutes = require("./raspberryRoutes");

var os = require("os");

var modulesRoutes = require("./modulesRoutes");
var servicesRoutes = require("./servicesRoutes");

module.exports = function(app) {

	app.get('/', function (req, res) {
		"use strict";
		res.sendFile('/index.html');
	});
	app.get("/api/config", function(req, res) {
		var host = os.hostname().split(":")[0];
		res.json({
			status: "success",
			"config": {
				mqtt: {
					url: "tcp://" + host + ":" +process.messager.getPort()
				}
			}
		});
	})
	userRoutes(app);
	//alarmRoutes(app);
	//gracenoteRoutes(app);
	raspberryRoutes(app);


	modulesRoutes(app);
	servicesRoutes(app);
};
