module.exports = function(app) {
	var UserMiddleware = require(__base + "middleware/user");
	var AuthManager = require(__base + "modules/AuthManager");

	
	app.post('/api/users/login', UserMiddleware.login);
	
	app.get('/api/users/login/services/:name', UserMiddleware.isLoggedIn, AuthManager.login);
	app.get('/api/users/login/services/:name/callback', UserMiddleware.isLoggedIn, AuthManager.loginCallback);

	app.get('/api/users/me', UserMiddleware.isLoggedIn, UserMiddleware.me);

	//app.get('/api/users/me/artists', UserMiddleware.isLoggedIn, UserMiddleware.myArtists);
};