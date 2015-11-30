module.exports = function(app) {
	var RaspberryMiddleware = require(__base + "middleware/raspberry");
	var UserMiddleware = require(__base + "middleware/user");

	app.post('/api/raspberries/', UserMiddleware.isLoggedIn, RaspberryMiddleware.add);
	app.get('/api/raspberries/', UserMiddleware.isLoggedIn, RaspberryMiddleware.getAll);
	app.get('/api/raspberries/:name', UserMiddleware.isLoggedIn, RaspberryMiddleware.get);
};