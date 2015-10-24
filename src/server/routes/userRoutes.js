module.exports = function(app) {
	var UserMiddleware = require(__base + "middleware/user");
	var ServicesManager = require(__base + "modules/ServicesManager");

	
	app.post('/api/users/login', UserMiddleware.login);
	
	app.get('/api/users/login/services/:name', UserMiddleware.isLoggedIn, ServicesManager.login);
	app.get('/api/users/login/services/:name/callback', UserMiddleware.isLoggedIn, ServicesManager.loginCallback);

	app.get('/api/users/me', UserMiddleware.isLoggedIn, UserMiddleware.me);

	//app.get('/api/users/me/artists', UserMiddleware.isLoggedIn, UserMiddleware.myArtists);
};