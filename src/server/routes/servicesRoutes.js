var ServicesMiddleware = require(__base + "middleware/ServicesMiddleware");

module.exports = function(app) {
	var userMiddleware = require(__base + "middleware/user");

	app.get("/api/services", userMiddleware.isLoggedIn, ServicesMiddleware.getAll);
};