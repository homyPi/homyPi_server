
/*global require*/
/*global console*/
/*global module*/
var _ = require("lodash"),
	SpotifyAuth = require('./SpotifyAuth.js'),
	config = require(__base + "data/private/config.js"),
	SpotifyWebApi = require('spotify-web-api-node'),
	mongoose = require("mongoose"),
	models = require(__base + "models/mongoose/mongoose-models.js"),
	Q = require('q');
var Promise = require("bluebird");
var winston = require('winston');

var Spotify = function (options, user) {"use strict";
	SpotifyWebApi.apply(this, [options]);
	this.user = user;
};
Spotify.prototype = SpotifyWebApi.prototype;        // Set prototype to Person's
Spotify.prototype.constructor = Spotify;

Spotify.prototype.me = function() {
	var api = this;
	return new Promise(function(resolve, reject) {
		if (api.spotifyUser) {
			return resolve(api.spotifyUser);
		}
		api.getMe()
			.then(function(me) {
				api.spotifyUser = me.body;
				return resolve(api.spotifyUser);
			})
			.catch(function(err) {
				return reject(err);
			});
	});
};

Spotify.prototype.getPlaylists = function () {
	'use strict';
	var api = this;
	return new Promise(function(resolve, reject) {
		var response = {};
		api.me().then(function(me) {
			api.getUserPlaylists(me.id, {limit: 50, offset: 0})
				.then(function (data) {
					response = data.body;
					var nbPromise = response.total - 50,
						promises = [];
					for (var i = 50; i < nbPromise+50; i+=50) {
						console.log("new playlist promise offset:"+i);
						promises.push(api.getUserPlaylists(me.id, {limit: 50, offset: i}));
					}
					var handleResults = function (results) {
						for (var i = 0; i < results.length; i++) {
							response.items = response.items.concat(results[i].body.items);
						}
						winston.info("found " + response.items.length + " playlists");
						console.log("GET SPOTIFY PLAYLIST: done");
						resolve(response);
					};
					Q.all(promises).then(handleResults, function(err) {
						reject(err);
					});
				})
				.catch(function (err) {
					console.log(err);
					reject(err);
				});
		});
	});
};
Spotify.prototype.getMyArtists = function() {
	var api = this;
	return new Promise(function(resolve, reject) {
		console.log("Spotify.getMyArtists: start");
		if (!api.user) {
			return reject({err: "user undefined"});
		}
		var Artist = models.Artist;
		Artist.find({"user._id": api.user._id}, function(err, artists) {
			if (err) {
				err.source = "Spotify.getMyArtists";
				return reject(err);
			} else {
				console.log("Spotify.getMyArtists: done");
				return resolve(artists);
			}
		});
	});
};
Spotify.prototype.reloadMyArtists = function (callback) {
	'use strict';
	var artists = [],
		counter = 0,
		exists = false;
	var api = this;
	winston.info("getting playlists");
	this.getPlaylists()
		.then(function (data) {
			console.log("RELOAD MY ARTISTS: got playlists");

			api.me().then(function(me) {
				Promise.each(data.items, function (item) {
					return new Promise(function(resolve, reject) {
						api.getPlaylistTracks(me.id, item.id, { 'offset' : 0, 'limit' : 50, 'fields' : 'items' }).then(
							function (data) {
								data = data.body;
								data.items.forEach(function (item) {
									exists = false;
									artists.forEach(function (a) {
										if (a.name === item.track.artists[0].name) {
											exists = true;
										}
									});
									if (!exists) {
										var a = new models.Artist();
										a.user = {
											_id: api.user._id,
											username: api.user.username
										};
										a.name = item.track.artists[0].name;
										a.spotifyId = item.track.artists[0].id;
										artists.push(a);
									}
								});
								return resolve();
							},
							function (err) {
								counter -= 1;
								winston.warn('Something went wrong!', err);
								return resolve();
							}
						);
					});
				}).then(function(data) {
					winston.info("updating/adding " + artists.length + " artists");
					var getSpotifyArtistsDataPromises = [];
					for(var o = 0; o < artists.length; o = o+50) {
						var ids = [];
						for(var artistIndex = o; artistIndex < Math.min(o+50, artists.length); artistIndex++) {

							ids.push(artists[artistIndex].spotifyId);
						}
						console.log("get artists " + JSON.stringify(ids));
						getSpotifyArtistsDataPromises.push(api.getArtists(ids))
					}
					Promise.all(getSpotifyArtistsDataPromises).then(function(results) {
						var counter = 0;
						console.log("got results: " + results.length);
						for(var i = 0; i < results.length; i ++) {
							var res = results[i].body;
							console.log("in result " + i + " got " + res.artists.length + " artists");
							for(var resId = 0; resId < res.artists.length; resId++) {
								artists[counter].images = res.artists[resId].images;
								counter++;
							}
						}
						Promise.each(artists, function(artist) {
							return new Promise(function(resolve, reject) {
								models.Artist.update({spotifyId: artist.spotifyId}, artist, {upsert: true}, function(err, data) {
									if (err) { return reject(err); } else { return resolve(artist)}
								})
							});
						}).then(function(data) {
							return callback(null, data);
						}).catch(function(err) { return callback(err);});
					});
				}).catch(function(err) { callback(err) });
			}).catch(function(err) { callback(err) });
		})
		.catch(function(err) { console.log(err);callback(err) });;
};
Spotify.prototype.getMySavedTracks = function (callback) {
	'use strict';
	this.getMySavedTracks({limit: 50, offset: 0}).then(
		function (data) {
			callback(null, data);
		},
		function (err) {
			console.log("err");
			console.log(err);
			callback(err);
		}
	);
};

Spotify.prototype.searchArtist = function (artist, callback) {
	'use strict';
	this.searchArtists(artist).then(
		function (data) {
			callback(null, data);
		},
		function (err) {
			winston.error("err ", err);
			callback(err);
		}
	);
};
Spotify.prototype.getArtistFull = function(id) {
	var api = this;
	return new Promise(function(resolve, reject) {
		var artist = {};
		var promises = [];

		promises.push(api.getArtist(id));
		promises.push(api.getArtistAlbums(id));
		promises.push(api.getArtistTopTracks(id, 'GB'));
		promises.push(api.getArtistRelatedArtists(id));

		Promise.all(promises).then(function(response) {
			artist = response[0].body;
			artist.albums = response[1].body.items;
			artist.top_tracks = response[2].body.tracks;
			artist.related_artists = response[3].body;
			resolve(artist);
		}).catch(reject);
	});
} 

Spotify.prototype.search = function (request, type) {
	'use strict';
	var api = this;
	return new Promise(function(resolve, reject) {
		var result = {};
		var promises = [];
		if (!type || type === "track") {
			result.tracks = promises.length;
			promises.push(api.searchTracks(request));
		}
		if (!type || type === "album") {
			result.albums = promises.length;
			promises.push(api.searchAlbums(request));
		}
		if (!type || type === "artist") {
			result.artists = promises.length;
			promises.push(api.searchArtists(request));
		}
		Promise.all(promises).then(function(response) {
			if (!type || type === "track") {
				result.tracks = response[result.tracks].body.tracks;
				result.tracks.items = result.tracks.items.map(Spotify.trackSpotifyToSchema);
			}
			if (!type || type === "track") {
				result.albums = response[result.albums].body.albums;
			}
			if (!type || type === "artist") {
				result.artists = response[result.artists].body.artists;
			}
			resolve(result);
		}).catch(function(err) {
			console.log(err);
			reject(err)
		});
	});
};
Spotify.prototype.getArtist = function (artist_id, callback) {
	'use strict';
	var waiting = 3,
		artist = {};
	this.getArtist(artist_id).then(
		function (data) {
			artist.data = data;
			waiting -= 1;
			if (!waiting) {
				callback(null, artist);
			}
		},
		function (err) {
			callback(err);
		}
	);
	this.getArtistAlbums(artist_id).then(
		function (data) {
			return data.items.map(function (a) { return a.id; });
		}
	).then(
		function (albums) {
			return Spotify.SpotifyApi.getAlbums(albums);
		}
	).then(
		function (data) {
			artist.albums = data.albums;
			waiting -= 1;
			if (!waiting) {
				callback(null, artist);
			}
		}
	).catch(
		function (error) {
			console.error(error);
		}
	);
	this.getArtistTopTracks(artist_id, 'GB').then(
		function (data) {
			artist.top_tracks = data.tracks;
			waiting -= 1;
			if (!waiting) {
				callback(null, artist);
			}
		},
		function (err) {
			winston.error('Something went wrong!', err);
		}
	);
};

Spotify.prototype.checkValidity = function(user) {
	var api = this;
	return new Promise(function(resolve, reject) {
		var d = new Date(new Date().getTime() - 10*60000);
		winston.info("check validity");
		winston.info("isExpired: " + api.user.tokens.spotify.expires_date + " < " + d.getTime());
		winston.info("isExpired: ", (api.user.tokens.spotify.expires_date < d.getTime()));
		if (user.tokens.spotify.expires_date < d.getTime()) {
			winston.info("refreshing token");
			api.refreshAccessToken().then(
				function (data) {
					data = data.body;
					winston.info("token refreshed");
					d.setHours(d.getHours() + 1);
					user.tokens.spotify.expires_date = d.getTime();
					user.tokens.spotify.access_token = data.access_token;
					api.setAccessToken(user.tokens.spotify.access_token);
					api.setRefreshToken(user.tokens.spotify.refresh_token);
					Spotify.saveToken(user, function(err) {
						if (!err) {
							return resolve(user);
						} else {
							return reject(err);
						}
					});
				},
				function (err) {
					return reject(err);
				}
			);
		} else {
			return resolve(user);
		}
	});
};
Spotify.saveToken = function (userReq, callback) {
	'use strict';
	var token = userReq.tokens.spotify;
	models.User.findOne({_id: userReq._id}, function (err, user) {
		if (err) {
			console.log(err);
			callback(err);
		}
		if (user === null) {
			callback({err: "unknown user"});
		} else {
			if (!user.tokens) {
				user.tokens = {};
			}
			user.tokens.spotify = {
				access_token: token.access_token,
				scope: token.scope,
				expires_date: token.expires_date,
				refresh_token: token.refresh_token
			};
			models.User.update({_id: user._id}, user, {}, function () {
				if (err) {
					callback(err);
				} else {
					callback(null);
				}
			});

		}
	});
};
Spotify.getToken = function(user) {
	return new Promise(function (resolve, reject) {
		'use strict';
		models.User.findOne({"_id": user._id}, function(err, user) {
			if (err) {
				err.source = "SpotifyAuth.get";
				return reject(err);
			} else {
				if (user && user.tokens && user.tokens.spotify) {
					return resolve(user);
				} else {
					return reject({err: "not token provided", source: "SpotifyAuth.get"});
				}
			}
		});
	});
};

Spotify.getApi = function(user) {
	return new Promise(function(resolve, reject) {
		Spotify.getToken(user)
			.then(function(user) {
				var api = new Spotify({
						clientId : config.spotify_config.client_id,
						clientSecret : config.spotify_config.client_secret,
						redirectUri : config.spotify_config.redirect_uri
					},
					user);
				var token = user.tokens.spotify;
				if ((!token || !token.access_token)) {
					return reject({err: "not logged in to spotify"});
				}
				api.setAccessToken(token.access_token);
				api.setRefreshToken(token.refresh_token);
				api.checkValidity(user)
					.then(function(token) {
						return resolve(api);
					})
					.catch(function(err) {
						return reject(err)
					});
			}).catch(function (err) {
				winston.error(err);
				return reject(err);
			});

	});
};

Spotify.trackSpotifyToSchema = function(spotifyData, track) {
	if (!track || !(track instanceof Object)) {
		track = {};
	}
	track._id = mongoose.Types.ObjectId();
	track.uri = track.uri || spotifyData.uri;
	track.name = spotifyData.name;
	track.duration_ms = spotifyData.duration_ms;
	track.artists = [];
	_.forEach(spotifyData.artists, function(artist) {
		console.log(JSON.stringify(track, null, 4));
		track.artists.push({
			id: artist.id,
			name: artist.name,
			uri: artist.uri
		});
	});
	track.album = {
		id: spotifyData.album.id,
		album_type: spotifyData.album.album_type,
		uri: spotifyData.album.uri,
		images: spotifyData.album.images
	};
	track.source = "spotify";
	return track;
}


module.exports = Spotify;

