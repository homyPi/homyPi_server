/**
 * Created by nolitsou on 9/8/15.
 */
var Alarm  = require(__base + "models/Alarm");
var Playlist  = require(__base + "models/Playlist");
var Raspberry  = require(__base + "models/Raspberry");
var Spotify  = require(__base + "modules/spotify/Spotify");
var MusicGraph = require(__base + "modules/MusicGraph");
var _ = require("lodash");

module.exports = function(socket) {
	socket.on("player:generatePlaylist", function(request) {
		MusicGraph.generatePlaylist(req.user)
			.then(function (playlist) {
				return res.json({playlist: playlist});
			})
			.catch(function (err) {
				return res.json({err: err});
			});
	});
	socket.on("player:resume", function() {
		console.log("player:resume");
		socket.broadcast.emit("player:resume");
	});
	socket.on("player:pause", function() {
		console.log("player:pause");
		socket.broadcast.emit("player:pause");
	});
	socket.on("player:next", function() {
		console.log("player:next");
		socket.broadcast.emit("player:next");
	});
	socket.on("player:previous", function() {
		console.log("player:previous");
		socket.broadcast.emit("player:previous");
	});
	socket.on("player:play:track", function(data) {
		console.log("player:play  " + JSON.stringify(data));
		socket.broadcast.emit("player:play:track", data);
	});
	socket.on("player:play:album", function(data) {
		var trackset = [];
		Spotify.getApi(socket.decoded_token).then(function(api) {
			api.getAlbumTracks(data.id).then(function(response) {
				_.forEach(response.body.items, function(item) {
					trackset.push({"source": "spotify", "uri": item.uri});
				});
				socket.broadcast.emit("player:play:trackset", {trackset: trackset});
			}).catch(function(err) {
				console.log(err);
			});
		});
	});
	socket.on("player:play:generated", function(data) {
		MusicGraph.generatePlaylist(socket.decoded_token, data).then(function(playlist) {
			var trackset = [];
			for(var i = 0; i < playlist.length; i++) {
				if (playlist[i].track) {
					trackset.push({
						source: "spotify",
						uri: playlist[i].track.uri,
						name: playlist[i].track.name
					});
				}
			} 
			console.log("SOCKET PLAYER GENERATE: got playlist: " + JSON.stringify(trackset, null, 4));
			socket.broadcast.emit("player:play:trackset", {"trackset": trackset});
		}).catch(function(err) {
			socket.emit("error", err);
		});
	});
	socket.on("player:play:trackset", function(data) {
		socket.broadcast.emit("player:play:trackset", data);
	});
	socket.on("player:playlist:add", function(data) {
		console.log("player:playlist:add  " + JSON.stringify(data));
		socket.broadcast.emit("player:playlist:add", data);
	});
	socket.on("player:playlist:remove", function(data) {
		console.log("player:playlist:remove  " + JSON.stringify(data));
		socket.broadcast.emit("player:playlist:remove", {_id: data._id});
	});
	socket.on("player:playing:id", function(data) {
		console.log("player:playing:id  " + JSON.stringify(data));
		Playlist.setPlayingId(data._id);
	});
	socket.on("player:status", function(request) {
		for(var i = 0 ; i < Raspberry.connectedClients.length; i++) {
			if (socket.id == Raspberry.connectedClients[i].socketId) {
				Raspberry.connectedClients[i].playerStatus = request.status;
			}
		}
		if(request.playingId) {
			Playlist.setPlayingId(request.playingId);
		}
		socket.broadcast.emit("player:status:updated", {socketId: socket.id, status: request.status});
	});
	socket.on("playlist:track:progress", function(data) {
		Playlist.trackOffset_ms = data.progress;
	});
	socket.on("playlist:track:progress:get", function(data) {
			socket.emit("playlist:track:progress", {trackOffset_ms: Playlist.trackOffset_ms})
	});
	socket.on("player:seek", function(data) {
			socket.broadcast.emit("player:seek", {progress_ms: data.progress_ms})
	});
};