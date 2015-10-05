module.exports = function(app) {
	var PlaylistMiddleware = require(__base + "middleware/playlist");
	var userMiddleware = require(__base + "middleware/user");

	app.get("/api/playlists", userMiddleware.isLoggedIn,  PlaylistMiddleware.get);
	app.get("/api/playlists/clear", userMiddleware.isLoggedIn,  PlaylistMiddleware.clearPlaylist);
	app.post("/api/playlists", userMiddleware.isLoggedIn,  PlaylistMiddleware.add);
	app.delete("/api/playlists/:trackId", userMiddleware.isLoggedIn,  PlaylistMiddleware.deleteTrack);

};