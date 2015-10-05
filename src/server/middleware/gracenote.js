/**
 * Created by nolitsou on 9/5/15.
 */
var Spotify = require(__base + "modules/spotify/Spotify");
var SpotifyAuth = require(__base + "modules/spotify/SpotifyAuth");
var GracenoteRhythm = require(__base + "modules/gracenote/GracenoteRhythm");
var Music = require(__base + "modules/Music");
var Promise = require("bluebird");
var generatePlaylist = function (req, res) {
	'use strict';
	Music.getRandomArtist(req.user).then(function(artists) {
		var options = {
			artists: artists,
			nb: req.param("nb")
		}
		GracenoteRhythm.createStation(options)
			.then(function(playlist) {
				Music.convertTracksetTo(playlist, "spotify", req.user)
					.then(function(tracks) {
						return res.json({playlist: tracks});
					}).catch(function(err) {
						console.log(err);
						return res.json({err: err});
					});
			})
			.catch(function(err) {
				console.log(err);
				return res.json({err: err});
			});
	}).catch(function(err) {
		console.log(err);
		return res.json({err: err})
	});
};

module.exports = {
	generatePlaylist: generatePlaylist
};