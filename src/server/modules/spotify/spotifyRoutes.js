module.exports = function(router) {
	var SpotifyMiddleware = require("./spotifyMiddleware");
	var userMiddleware = require(__base + "middleware/user");
	
	router.get("/", function(req, res) {
		res.json({"name": "Spotify", "status": "up"});
	})
	
	router.get("/me", userMiddleware.isLoggedIn, SpotifyMiddleware.getApi, SpotifyMiddleware.getMe);
	router.get("/login", userMiddleware.isLoggedIn, SpotifyMiddleware.login);
	router.get("/me/artists", userMiddleware.isLoggedIn, SpotifyMiddleware.getApi, SpotifyMiddleware.getMyArtists);
	router.get("/me/artists/reload", userMiddleware.isLoggedIn, SpotifyMiddleware.getApi, SpotifyMiddleware.reloadMyArtists);
	
	router.get("/search", userMiddleware.isLoggedIn, SpotifyMiddleware.getApi, SpotifyMiddleware.search);
	router.get("/artists/:id", userMiddleware.isLoggedIn, SpotifyMiddleware.getApi, SpotifyMiddleware.getArtist);
	
	router.post("/:type/search", SpotifyMiddleware.getApi, SpotifyMiddleware.search);


	router.get('/oauth2callback', SpotifyMiddleware.oauth2callback);

	return router;
};