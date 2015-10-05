var config = require(__base + 'data/private/config.json').gracenote_config,
	request = require('request'),
	Promise = require("bluebird"),
	_ = require("lodash");
	
baseUrl = "https://" + config.client_id + ".web.cddbp.net/webapi/json/1.0/";

var createStation = function (options) {
	return new Promise(function(resolve, reject) {
		var url = baseUrl + "radio/create";
		var query = {
			client: config.api_key,
			user: config.user_id_test,
			seed: []
		};
		if (!options.nb) {
			options.nb = 3;
		}
		_.forEach(options.artists, function(artist) {
			var seeds = [];
			if (artist.name) {
				seeds.push("text_artist_" + artist.name +"");
			}
			if (seeds.length) {
				query.seed.push("(" + seeds.join(";") + ")");
			}
		});
		query.seed = query.seed.join(";");
		query.return_count = options.nb;
		console.log(query);
		request.get({
			url: url,
			qs: query,
			json: true
		}, function(err, response, body) {
			console.log(body);
			if (!err) {
				var playlist = [];
				if (body.RESPONSE 
					&& body.RESPONSE[0]
					&& body.RESPONSE[0].STATUS == "OK"
					&& body.RESPONSE[0].ALBUM) {
					for(var i = 0; i < body.RESPONSE[0].ALBUM.length; i++) {
						var trackData = body.RESPONSE[0].ALBUM[i];
						var track = {};
						if (trackData.ARTIST
							&& trackData.ARTIST[0]
							&& trackData.ARTIST[0].VALUE) {
							track.artist_name = trackData.ARTIST[0].VALUE;
						}
						if (trackData.TITLE
							&& trackData.TITLE[0]
							&& trackData.TITLE[0].VALUE) {
							track.title = trackData.TITLE[0].VALUE;
						}
						playlist.push(track);
						if (playlist.length === options.nb) {
							break;
						}
					}
					return resolve(playlist);
				} else {
					return reject({err: "error"});
				}
			} else {var playlist = [];
				if (body.RESPONSE 
					&& body.RESPONSE[0]
					&& body.RESPONSE[0].STATUS == "OK"
					&& body.RESPONSE[0].ALBUM) {
					for(var i = 0; i < body.RESPONSE[0].ALBUM.length; i++) {
						var trackData = body.RESPONSE[0].ALBUM[i];
						var track = {};
						if (trackData.ARTIST
							&& trackData.ARTIST[0]
							&& trackData.ARTIST[0].VALUE) {
							track.artist_name = trackData.ARTIST[0].VALUE;
						}
						if (trackData.TITLE
							&& trackData.TITLE[0]
							&& trackData.TITLE[0].VALUE) {
							track.title = trackData.TITLE[0].VALUE;
						}
						playlist.push(track);
						if (playlist.length === options.nb) {
							break;
						}
					}
					return resolve(playlist);
				} else {
					return reject({err: "error"});
				}
				return reject(err);
			}
		});
	});
}

module.exports = {
	createStation: createStation
};