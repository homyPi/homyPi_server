/**
 * Created by nolitsou on 9/5/15.
 */
module.exports = function(app) {
	var MusicGraphMiddleware = require(__base + "middleware/musicGraph");
	var userMiddleware = require(__base + "middleware/user");

	app.get('/api/musicgraph/playlist', userMiddleware.isLoggedIn, MusicGraphMiddleware.playlist);
};