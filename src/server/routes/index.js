var musicGraphRoutes = require("./musicGraphRoutes");
var userRoutes = require("./userRoutes");
//var gracenoteRoutes = require("./gracenoteRoutes");
var raspberryRoutes = require("./raspberryRoutes");

var modulesRoutes = require("./modulesRoutes");
var servicesRoutes = require("./servicesRoutes");

module.exports = function(app) {

	app.get('/', function (req, res) {
		"use strict";
		res.sendFile('/index.html');
	});
	musicGraphRoutes(app);
	userRoutes(app);
	//alarmRoutes(app);
	//gracenoteRoutes(app);
	raspberryRoutes(app);


	modulesRoutes(app);
	servicesRoutes(app);
};