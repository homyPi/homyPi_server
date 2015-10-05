/*es5:true*/
/*global require*/
/*global module*/
/*global console*/
var config = require(__base + "data/private/config.js"),
	mongoose = require("mongoose"),
	request = require("request-promise"),
	models = require(__base + "models/mongoose/mongoose-models.js"),
	winston = require("winston"),
	Spotify = require("./Spotify.js");

var SpotifyAuth = function () {"use strict"; };

SpotifyAuth.credentials = {
	access_token: null,
	scope: null,
	expires_date: null,
	refresh_token: null
};


SpotifyAuth.config = config.spotify_config;
SpotifyAuth.connectUrl = function (user) {
	"use strict";
	return "https://accounts.spotify.com/authorize?client_id=" + config.spotify_config.client_id + "&redirect_uri=" + config.host_url + config.spotify_config.redirect_url + "&response_type=" + config.spotify_config.response_type +
		"&scope=" + config.spotify_config.scope + "&state={\"uId\": \"" + user._id + "\"}";
};
SpotifyAuth.getToken = function (uId, code, callback) {
	"use strict";
	var data = {
		'client_id': config.spotify_config.client_id,
		'client_secret': config.spotify_config.client_secret,
		'grant_type': 'authorization_code',
		'redirect_uri': config.host_url + config.spotify_config.redirect_url,
		'code': code
	};
	request({
		uri: "https://accounts.spotify.com/api/token",
		method: "POST",
		form: data
	}).then(function (response) {
		var json = JSON.parse(response);
		var d = new Date();
		d.setHours(d.getHours() + 1);
		SpotifyAuth.credentials = {
			access_token: json.access_token,
			scope: json.scope,
			expires_date: d.getTime(),
			refresh_token: json.refresh_token
		};

		SpotifyAuth.save({_id: uId}, function(err) {
			callback(err, response);
		});

	}).catch(function(error) {
		console.error(error);
		callback(error);
	});
};


SpotifyAuth.refresh = function (user, callback) {
	'use strict';
	Spotify.SpotifyApi.refreshAccessToken().then(function (data) {
		SpotifyAuth.credentials.access_token = data.access_token;
		SpotifyAuth.save(user);
		console.log("refreshed");
		callback(null, data);
	}, function (err) {
		console.log(err);
		callback(err);
	});
};
SpotifyAuth.userInfo = function (callback) {
	"use strict";
	var options = {
		url: 'https://api.spotify.com/v1/me',
		headers: {
			'Authorization': 'Bearer ' + SpotifyAuth.credentials.access_token
		},
		json: true
	};

	// use the access token to access the Spotify Web API
	request.get(options, function (err, response, body) {
		callback(err, body);
	});
};



module.exports = SpotifyAuth;