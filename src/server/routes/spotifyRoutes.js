module.exports = function(app) {
	var SpotifyMiddleware = require(__base + "middleware/spotify");
	var userMiddleware = require(__base + "middleware/user");

	app.get('/api/spotify/me', userMiddleware.isLoggedIn, SpotifyMiddleware.getApi, SpotifyMiddleware.getMe);
	app.get('/api/spotify/login', userMiddleware.isLoggedIn, SpotifyMiddleware.login);
	app.get("/api/spotify/me/artists", userMiddleware.isLoggedIn, SpotifyMiddleware.getApi, SpotifyMiddleware.getMyArtists);
	app.get("/api/spotify/me/artists/reload", userMiddleware.isLoggedIn, SpotifyMiddleware.getApi, SpotifyMiddleware.reloadMyArtists);
	
	app.get("/api/spotify/search", userMiddleware.isLoggedIn, SpotifyMiddleware.getApi, SpotifyMiddleware.search);
	app.get("/api/spotify/artists/:id", userMiddleware.isLoggedIn, SpotifyMiddleware.getApi, SpotifyMiddleware.getArtist);
	
	app.post("/api/spotify/:type/search", SpotifyMiddleware.getApi, SpotifyMiddleware.search);


	app.get('/api/spotify/oauth2callback', SpotifyMiddleware.oauth2callback);
};