module.exports = function(app) {
	var RaspberryMiddleware = require(__base + "middleware/raspberry");
	var UserMiddleware = require(__base + "middleware/user");

	app.get('/api/raspberries/', UserMiddleware.isLoggedIn, RaspberryMiddleware.getAll);
};