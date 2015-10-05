module.exports = function(app) {
	var GracenoteMiddleware = require(__base + "middleware/gracenote");
	var UserMiddleware = require(__base + "middleware/user");
	var SpotifyMiddleware = require(__base + "middleware/spotify");
	
	app.get('/api/music/gracenote/playlist', UserMiddleware.isLoggedIn, SpotifyMiddleware.getApi, GracenoteMiddleware.generatePlaylist);
};