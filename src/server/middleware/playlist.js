var Playlist = require(__base + "models/Playlist");

/**
 * Get current trackset
 */
var get = function(req, res) {
	Playlist.get().then(function(playlist) {
		res.json({playlist: {"trackset": playlist.tracks, "idPlaying": playlist.idPlaying}});
	});
};

/**
 * Delete a track from current trackset
 * @param {ObjectId} req.params.trackId Id of the track to delete
 */
var deleteTrack = function(req, res) {
	Playlist.deleteTrack(req.params.trackId).then(function() {
		res.json({status: "success"});
	}).catch(function(err) {
		res.json({err: err});
	});
};


var add = function(req, res) {
	var data = req.body;
	console.log("MIDDLEWARE_ADD_PLAYLIST: get playlist");
	Playlist.get().then(function(playlist) {
		console.log("MIDDLEWARE_ADD_PLAYLIST: got playlist");
		if (data.track) {
			console.log("MIDDLEWARE_ADD_PLAYLIST: add track");
			Playlist.addTrack(req.user, data.track, playlist)
				.then(function(track) {
					res.json({track: track});
				}).catch(function(err) {
					console.log("===========");
					console.log(err);
					console.log("===========");
					res.json({err: err});
				});
		} else if (data.trackset) {
			console.log("MIDDLEWARE_ADD_PLAYLIST: add trackset");
			Playlist.addTrackset(req.user, data.trackset, playlist)
				.then(function(playlist) {
					res.json({trackset: playlist.tracks});
				}).catch(function(err) {
					console.log(err);
					res.json({err: err});
				});
		} else {
			res.json({err: "invalid request"});
		}
	});
}
/**
 * Remove al tracks from trackset
 */
var clearPlaylist = function(req, res) {
	Playlist.clearPlaylist().then(function() {
		console.log("CLEAR_PLAYLIST: done");
		res.json({"status": "success"});
	}).catch(function(err) {
		console.log("===========");
		console.log(err);
		res.json({err: err});
	})
};

module.exports = {
	get: get,
	deleteTrack: deleteTrack,
	add: add,
	clearPlaylist: clearPlaylist
}