/*global require*/
/*global module*/
/*global console*/
/*jshint -W083 */
/*loopfunc: true*/
var config = require(__base + 'data/private/config.json'),
	request = require('request'),
	qs = require('qs'),
	winston = require('winston'),
	Spotify = require('./spotify/Spotify.js'),
	Q = require("q"),
	models = require(__base + 'models/mongoose/mongoose-models.js'),
	Promise = require("bluebird"),
	_ = require("lodash");



var MusicGraph = function () {"use strict"; };

MusicGraph.api_key = config.musicgraph_config.api_key;
MusicGraph.api_url = config.musicgraph_config.api_url;

MusicGraph.generatePlaylist = function(user, options) {
	return new Promise(function(resolve, reject) {
		var counter = 0,
			response = [];
		if (!options) {
			options = {};
		}
		if (!options.nbTracks) {
			options.nbTracks = 3
		}
		var date1 = new Date();
		console.log("GET PLAYLIST");
		console.log("GET PLAYLIST: get Spotify API");
		Spotify.getApi(user)
			.then(function(spotifyApi) {
				console.log("GET PLAYLIST: get my artists");
				spotifyApi.getMyArtists(user)
					.then(function (data) {
						console.log("GET PLAYLIST: generate playlist");
						MusicGraph.generatePlaylistFromArtists(data, {convertTo: "spotify", api:spotifyApi, nbTracks: options.nbTracks})
						.then(function (playlist) {
							console.log("GET PLAYLIST: got playlist from artist ");
							var date2 = new Date();
							console.log("GET PLAYLIST: duration: " + (date2 - date1));
							return resolve(playlist);
						}).catch(function (err) {
							console.log("GET PLAYLIST: coulnd't generate a playlist");
							console.error(err);
							return reject(err);
						});
					}).catch(function (err) {
						console.error(err);
						return reject(err);
					});
			}).catch(function(err) {
				return reject(err);
			})
	});
};


MusicGraph.searchArtist = function (data) {
	"use strict";
	return new Promise(function(resolve, reject) {
		var uri = MusicGraph.api_url + "artist/search";
		data.api_key = MusicGraph.api_key;
		uri += "?" + qs.stringify(data);
		request({
			uri: uri,
			method: "GET"
		}, function(err, response, body) {
			if (err) {
				return reject(err);
			} else {
				MusicGraph.responseHandler(body).then(function (data) {
					return resolve(data.data);
				}).catch(reject);
			}
		})
	});
};
MusicGraph.playlist = function (data) {
	"use strict";
	new Promise(function(resolve, reject) {
		var uri = MusicGraph.api_url + "playlist",
			i = 0,
			artists = "";
		data.api_key = MusicGraph.api_key;
		if (typeof data.artist_ids !== 'string') {
			for (i = 0; i < data.artist_ids.length; i += 1) {
				artists += data.artist_ids[i];
				if (i !== data.artist_ids.length - 1) {
					artists += ",";
				}
			}
			data.artist_ids = artists;
		}
		uri += "?" + qs.stringify(data);
		request({
			uri: uri,
			method: "GET"
		}).then(function (response) {
			var json = null;
			try {
				json = JSON.parse(response.body);
				return resolve(json);
			} catch (e) {
				return reject(e);
			}
		}).catch(function(err) {
			reject(err);
		});
	});
};

MusicGraph.randomArtist = function (artistList) {
	'use strict';
	return new Promise(function(resolve, reject) {
		var artist = {name: artistList[Math.floor((Math.random() * artistList.length))].name};
		console.log("looking for "+ artist.name);
		MusicGraph.searchArtist({name: artist.name})
			.then(function (artists) {
				if (artists[0]) {
					artist.musicgraphId = artists[0].id;
					return resolve(artist);
				} else {
					return MusicGraph.randomArtist(artistList).then(resolve).catch(reject);
				}
			}).catch(reject);
	});
};

MusicGraph.fluidTempo = function (currentId, total) {
	'use strict';
	var tempo = {},
		t1 = Math.round(total / 3),
		t2 = Math.round(total / 3 * 2),
		t3 = Math.round(total / 3 * 3);
	if (currentId < t1) {
		tempo = {id: 0, value: "slow"};
	} else if (currentId >= t1 && currentId < t2) {
		tempo = {id: 1, value: "moderate"};
	} else {
		tempo = {id: 2, value: "fast"};
	}
	return tempo;
};
MusicGraph.compareByTempo = function (a, b) {
	'use strict';
	if (a.tempoId && b.tempoId) {
		if (a.tempoId < b.tempoId) {
			return -1;
		}
		if (a.tempoId > b.tempoId) {
			return 1;
		}
	}
	return 0;
};
MusicGraph.generateArtistPlaylist = function (artistId, options) {
	'use strict';
	return new Promise(function(resolve, reject) {
		var uri = MusicGraph.api_url + "playlist",
			query = {
				api_key: MusicGraph.api_key,
				artist_ids: artistId
			};
		if (options.tempo) {
			query.tempo = options.tempo;
		}
		uri += "?" + qs.stringify(query);
		request({
			uri: uri,
			method: 'GET'
		}).then(function (response) {
			MusicGraph.responseHandler(response)
				.then(resolve)
				.catch(reject);
		}).catch(reject);
	});
};
MusicGraph.convertTrackTo = function(track, to, api) {
	return new Promise(function(resolve, reject) {
		if (to == "spotify") {
			console.log("CONVERT TRACK TO SPOTIFY: artist name = " + track.artist_name + " title = " + track.title)
			api.searchTracks(track.artist_name + " " + track.title, { 'offset' : 0, 'limit' : 1}).then(function (data) {
				var track = data.body.tracks.items[0];
				console.log("CONVERT TRACK TO SPOTIFY: search track: Got song");
				return resolve(track);
			}).catch(function (err) {
				err.source = "Spotify.searchTrack";
				console.log(err);
				return reject(err);
			});
		} else {
			return resolve();
		}
	});
}
MusicGraph.getATrack = function(trackInfo, options) {
	var uri = MusicGraph.api_url + "playlist";
	return new Promise(function(resolve, reject) {
		console.log("GET_A_TRACK: started");
		MusicGraph.getMusicGraphId(trackInfo.similarTo).then(function(id) {
			trackInfo.similarTo.musicgraphId = id;
			trackInfo.query.artist_ids = id;
			console.log(JSON.stringify(trackInfo.query, null, 4));
			uri += "?" + qs.stringify(trackInfo.query);
			winston.info(uri);
			MusicGraph.execute(uri, 'get', {tempoId: trackInfo.tempoId}).then(function (json) {
				function getRandomFromResults() {
					if (!json.data || !json.data.length) {
						console.log("GET_A_TRACK: result empty");
						console.log("response was = " + JSON.stringify(json, null, 4));
						return MusicGraph.getATrack(trackInfo, options).then(resolve).catch(function(err) {reject(err)});
					} else {
						var i = Math.floor((Math.random() * (json.data.length -1)));
						item = json.data[i];
						if (options.convertTo && options.api) {
							console.log("GET_A_TRACK: convert to " + options.convertTo);
							MusicGraph.convertTrackTo(item, options.convertTo, options.api).then(function(data) {
								if (!data) {
									json.data.splice(i, 1);
									return getRandomFromResults();
								} else {
									trackInfo.track = data;
									return resolve(trackInfo);
								}
							}).catch(reject);
						} else {
							trackInfo.track = item;
							return resolve(trackInfo);
						}
					}
				};
				getRandomFromResults();
			}).catch(function(err) {
				console.log("!!!!!!!!!!!!!!!!!!!");
				console.warn(JSON.stringify(err, null, 4));
				console.log("!!!!!!!!!!!!!!!!!!!");
				return MusicGraph.getATrack(trackInfo, options).then(resolve).catch(function(err) {reject(err)});
			});
		}).catch(function(err) {
			if (err.code === -1) {
				reject(err);
			} else {
				return reject(err);
			}
		});
	});
};
MusicGraph.generatePlaylistFromArtistsRequestsOptions = function(similarToIds, options) {
	var i = 0,
		result = [];
		if (!options.nbTracks) {
			options.nbTracks == 3;
		}
	var nb = options.nbTracks,
		slowMaxBound = Math.round(nb / 3),
		mediumMaxBound = Math.round(nb / 3 * 2),
		t3 = Math.round(nb / 3 * 3),
		tempoId = 0;
	var requestsOptions = [];
	for (i = 0; i < nb; i += 1) {
		var query = {};
		query.api_key = MusicGraph.api_key;
		query.tempo = "any";
		query.artist_ids = "";

		if (i < slowMaxBound) {
			query.tempo = "slow";
			tempoId = 0;
		} else if (i >= slowMaxBound && i < mediumMaxBound) {
			query.tempo = "moderate";
			tempoId = 1;
		} else {
			query.tempo = "fast";
			tempoId = 2;
		}
		requestsOptions.push({
			query: query,
			tempoId: tempoId,
			similarTo: similarToIds[Math.floor((Math.random() * similarToIds.length))]
		});
	}
	console.log("requestsOptions =====>", JSON.stringify(requestsOptions, null));
	return requestsOptions;
}

MusicGraph.generatePlaylistFromArtists = function (similarToIds, options) {
	'use strict';
	return new Promise(function(resolve, reject) {
		var getTracksPromises = [];
		var playlists = MusicGraph.generatePlaylistFromArtistsRequestsOptions(similarToIds, options);
		_.forEach(playlists, function(playlistData) {
			console.log("GET A TRACK WITH " + JSON.stringify(playlistData, null, 4));
			getTracksPromises.push(MusicGraph.getATrack(playlistData, options));
		})
		Promise.all(getTracksPromises)
			.then(function(getTracks) {
				return resolve(getTracks);
			})
			.catch(function(err) {
				if (err.code && err.code === -1) {
					console.log("got error " + err.code);
					return MusicGraph.generatePlaylistFromArtists(similarToIds, options).then(resolve).catch(reject);
				} else {
					return reject(err);
				}
			});
	});
};
MusicGraph.execute = function (uri, method, requestDetails) {
	'use strict';
	return new Promise(function(resolve, reject) {
		request({
			uri: uri,
			method: method
		}, function (err, response, body) {
			if (!err && response.statusCode == 200) {
				var json = JSON.parse(body);
				json.requestDetails = requestDetails;
				return resolve(json);
			} else {
				if (err) {
					console.log("=========mg err=======");
					console.log(JSON.stringify(err, null, 4));
					console.log("======================");
					return reject(err);
				} else if (response.statusCode === 409 || response.statusCode === 429) {
					/*-------if rate limite, waiting before reject--------*/
						console.log("MUSIC GRAPH: waiting for 60s!!");
					setTimeout(function() {
						reject(err);
					}, 60000);
				} else {
					console.log("=========mg err=======");
					console.log(JSON.stringify(response, null, 4));
					console.log("======================");
					reject();
				}
			}
		})
	});
};
MusicGraph.responseHandler = function (response) {
	'use strict';
	return new Promise(function(resolve, reject) {
		try {
			var json = JSON.parse(response);
			if (json.status && json.status.code !== undefined) {
				if (json.status.code === 0) {
					return resolve({pagination: json.pagination, data: json.data});
				} else {
					return reject(json.status);
				}
			} else {
				winston.warn({type: "api", code: json.status});
				reject({type: "api", code: json.status});
			}
		} catch (e) {
			console.log("response = ", response);
			winston.error('error ', e);
			reject(e);
		}
	});
};
MusicGraph.randomPlaylist = function (artists, options) {
	'use strict';
	return new Promise(function(resolve, reject) {
		if (!options) {
			options = {};
		}
		if (!options.tempo) {
			options.tempo = "any";
		}
		MusicGraph.randomArtist(artists).then(function (artist) {
			console.log(artist);
			MusicGraph.generateArtistPlaylist(artist.musicgraphId, {tempo: options.tempo}).then(function (data) {
				if (data.pagination.count < 1) {
					reject("empty playlist");
				} else {
					resolve({playlist: data.data, request_options: options});
				}
			}).catch(reject);
		}).catch(reject);
	});
};
/**
 *
 * @param artists: [required]
 * @param options: [optional]
 * @param callback: [required]
 */
MusicGraph.getTrack = function(artists, i, options) {
	"use strict";
	var tempo = MusicGraph.fluidTempo(i, options.number);
	MusicGraph.randomPlaylist(artists, {tempo: tempo.value}, function (err, data) {

	});
};
MusicGraph.playlistFromArtistNames = function (artists, options, callback) {
	'use strict';
	var i = 0,
		requests = 0,
		playlist = [];
	if (!options) {
		options = {};
	}
	if (!options.number) {
		options.number = 3;
	}
	if (!options.tempo || (options.tempo !== 'any' && options.tempo !== 'increasing' && options.tempo !== 'descending')) {
		options.tempo = "any";
	}
	requests = options.number;
	for (i = 0; i < options.number; i += 1) {
		(function getTrack(i) {
			var tempo = MusicGraph.fluidTempo(i, options.number),
				title,
				artist_name,
				random;
			MusicGraph.randomPlaylist(artists, {tempo: tempo.value})
				.then(function(data) {
					var valid = false,
						current_track = {};
					if (data.playlist.length > 0) {
						while (!valid) {
							random = Math.floor((Math.random() * data.playlist.length));
							title = data.playlist[random].title;
							artist_name = data.playlist[random].artist_name;
							valid = true;
							console.log("got " + data.playlist[random].title + " by " + data.playlist[random].artist_name);
							playlist.forEach(function (track) {
								if (track.title === title && track.artist_name === artist_name) {
									valid = false;
								}
							});
						}
						current_track = {title: title, artist_name: artist_name, tempo: tempo};
						console.log("searching on spotify "+current_track.artist_name+"  "+current_track.title);

						Spotify.searchTrack({
							artist: current_track.artist_name,
							track: current_track.title
						}).then(
							function (data) {
								if(data.tracks && data.tracks.items) {
									current_track.dataType = "api_data";
									current_track.source = "spotify";
									current_track.link = data.tracks.items[0];
									playlist.push(current_track);
									requests -= 1;
									console.log(requests+" requests left");
									if (!requests) {
										callback(null, playlist);
									}

								} else {
									console.log("error");
									getTrack(i);
								}
							},
							function (err) {
								console.log(err);
								console.log("fail!!!!!!!!!!!!!!!");
								console.log(err);
								getTrack(i);
							}
						);


					} else {
						console.log(data);
						valid = false;
						getTrack(i);
					}
				}, function (err) {
					console.log(err);
					getTrack(i);
				});
		})(i);
	}
};
MusicGraph.getMusicGraphId = function(artist) {
	return new Promise(function(resolve, reject) {
		if (artist.musicgraphId) {
			return resolve(artist.musicgraphId);
		} else {
			MusicGraph.searchArtist({name: artist.name})
				.then(function(mGArtists) {
					if (mGArtists[0]) {
						artist.musicgraphId = mGArtists[0].id;
						models.Artist.update({_id: artist._id}, {$set: {musicgraphId: mGArtists[0].id}}, {}, function(err, data) {
							if (err) {
								return reject(err);
							} else {
								return resolve(artist.musicgraphId);
							}
						});
					} else {
						return reject({code: -1, message: "unable to find " + artist.name})
					}
				})
				.catch(reject);
		}
	});
};

module.exports = MusicGraph;