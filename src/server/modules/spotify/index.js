var express = require("express");
var moduleManager = require("../ModuleManager");
var routes = require("./spotifyRoutes");

module.exports = {
	link: function() {
		moduleManager.get("music").addSource({
			name: "Spotify",
			module: this
		});
	},
	routes: routes
}