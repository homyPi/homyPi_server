var PlaylistModel = require(__base + "models/mongoose/mongoose-models.js").Playlist;
var Spotify = require(__base + "modules/spotify/Spotify");
var mongoose = require('mongoose');
var _ = require("lodash");


var initPlaylist = function(tracks) {
	return new Promise(function(resolve, reject) {
		var playlist = new PlaylistModel();
		playlist._id = mongoose.Types.ObjectId();
		playlist.tracks = tracks || [];
		if (tracks) {
			playlist.idPlaying = 0;
		}
		playlist.save(function(err) {
			if (err) {
				return reject(err);
			} else {
				return resolve(playlist);
			}
		});
	});
};
var getTrackData = function(user, track) {
	return new Promise(function(resolve, reject) {
		if (track.source === "spotify") {
			Spotify.getApi(user).then(function(api) {
				track.id = track.uri.split(":")[2];
				console.log("track uri = " + track.uri + "  ==>  id = " + track.id);
				api.getTrack(track.id).then(function(response) {
					trackData = response.body;
					Spotify.trackSpotifyToSchema(trackData, track);
					console.log("GET_TRACK: got track data: " + JSON.stringify(track, null, 4));
					resolve(track);
				}).catch(function(err) {
					console.log("GET_TRACK: error in getTrack: " + err);
					console.log("GET_TRACK: error was for track uri = " + track.uri + "  ==>  id = " + track.id);
					reject(err);
				});
			}).catch(function(err) {
				console.log("GET_TRACK: error in getAPI: " + err);
				reject(err);
			})
		}
	});
}
var getTracksData = function(user, tracks) {
	return new Promise(function(resolve, reject) {
		Spotify.getApi(user).then(function(api) {
			ids = tracks.map(function(track) {
				console.log("GET_TRACK_DATA: track = " + track)
				track.id = track.uri.split(":")[2];
				return track.id;
			});
			console.log("GET_TRACK_DATA ids = " + ids);
			api.getTracks(ids).then(function(response) {
				tracksData = response.body.tracks;
				tracks = [];
				for (var i = 0; i < tracksData.length; i++) {
					tracks.push(Spotify.trackSpotifyToSchema(tracksData[i], tracks[i]));
				}
				resolve(tracks);
			}).catch(function(err) {
				console.log("GET_TRACK_DATA: error in getTracksData: " + err);
				reject(err);
			});
		}).catch(function(err) {
			console.log("GET_TRACK_DATA: error in getAPI: " + err);
			reject(err);
		})
	});
}
var get = function() {
	return new Promise(function(resolve, reject) {
		PlaylistModel.findOne({}, function(err, playlist) {
			if (err) {
				return reject(err);
			} else {
				if (!playlist) {
					initPlaylist().then(resolve).catch(reject);
				} else {
					resolve(playlist);
				}
			}
		});
	});
};
var addTrack = function(user, track, playlist) {
	return new Promise(function(resolve, reject) {
		getTrackData(user, track).then(function(track) {
			console.log("PLAYLIST_ADD_TRACK: got track data");
			playlist.tracks.push(track);
			playlist.save(function(err) {
				if (err) {
					console.log("PLAYLIST_ADD_TRACK: error on saving: " + err);
					return reject(err);
				} else {
					console.log("PLAYLIST_ADD_TRACK: saved");
					process.io.sockets.emit("playlist:track:added", {track:track});
					return resolve(track);
				}
			})
		}).catch(reject);
	});
};
var deleteTrack = function(trackId) {
	return new Promise(function(resolve, reject) {
		get().then(function(playlist) {
			for(var i = 0; i < playlist.tracks.length; i++) {
				if (playlist.tracks[i]._id.equals(trackId)) {
					console.log("found track to delete " + playlist.tracks[i]);
					playlist.tracks.splice(i, 1);
					break;
				}
			}
			playlist.save(function(err) {
				if (err) {
					return reject(err);
				}
				process.io.sockets.emit("playlist:track:removed", {_id:trackId});
				return resolve();
			})
		}).catch(reject);
	});
}
var addTrackset = function(user, trackset, playlist) {
	return new Promise(function(resolve, reject) {
		getTracksData(user, trackset).then(function(trackset) {
			if (!playlist.tracks) {
				playlist.tracks = trackset;
			} else {
				playlist.tracks = playlist.tracks.concat(trackset);
			}
			playlist.save(function(err) {
				if (err) {
					console.log("save playlist err");
					console.log(err);
					return reject(err);
				} else {
					process.io.sockets.emit("playlist:track:added", {trackset:trackset});
					return resolve(playlist);
				}
			});
		}).catch(reject);
	});
};
var clearPlaylist = function() {
	console.log("clearPlaylist");
	return new Promise(function(resolve, reject) {
		get().then(function(playlist) {
			console.log("got playlist");
			playlist.tracks = [];
			playlist.save(function(err) {
				if (err) {
					console.log("=========");
					console.log(err);
					return reject(err);
				} else {
					process.io.sockets.emit("playlist:track:clear");
					return resolve();
				}
			})
		}).catch(reject);
	});
}
var setPlayingId = function(_id) {
	return new Promise(function(resolve, reject) {
		get().then(function(playlist) {
			playlist.idPlaying = _id;
			playlist.save(function(err) {
				if (err) {
					console.log("=========");
					console.log(err);
					return reject(err);
				} else {
					console.log("set idPlaying = " + _id);
					process.io.sockets.emit("playlist:playing:id", {idPlaying: _id});
					return resolve();
				}
			})
		}).catch(reject);
	});
};

trackOffset_ms = 0;


module.exports = {
	initPlaylist: initPlaylist,
	get: get,
	addTrack: addTrack,
	addTrackset: addTrackset,
	deleteTrack: deleteTrack,
	clearPlaylist: clearPlaylist,
	setPlayingId: setPlayingId,
	trackOffset_ms: trackOffset_ms
};