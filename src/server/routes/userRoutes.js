module.exports = function(app) {
	var UserMiddleware = require(__base + "middleware/user");
	
	app.post('/api/users/login', UserMiddleware.login);

	app.get('/api/users/me', UserMiddleware.isLoggedIn, UserMiddleware.me);

	//app.get('/api/users/me/artists', UserMiddleware.isLoggedIn, UserMiddleware.myArtists);
};