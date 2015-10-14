var musicGraphRoutes = require("./musicGraphRoutes");
var userRoutes = require("./userRoutes");
var alarmRoutes = require("./alarmRoutes");
//var gracenoteRoutes = require("./gracenoteRoutes");
var raspberryRoutes = require("./raspberryRoutes");

var modulesRoutes = require("./modulesRoutes");

module.exports = function(app) {

	app.get('/', function (req, res) {
		"use strict";
		res.sendFile('/index.html');
	});
	musicGraphRoutes(app);
	userRoutes(app);
	alarmRoutes(app);
	//gracenoteRoutes(app);
	raspberryRoutes(app);


	modulesRoutes(app);
};