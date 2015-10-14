var express = require("express");
var playlistRoutes = require("./playlist/playlistRoutes");

var sources = [];

module.exports = {
	addSource: function(module, name) {
		sources.push({name: module.name});
		console.log(sources);
	},
	routes: function(app, router) {
		router.get("/", function(req, res) {
			res.json({"name": "music", "status": "up"});
		});
		router.get("/sources", function(req, res) {
			res.json(sources);
		});
		playlistRoutes(router);
		return router;
	}
}