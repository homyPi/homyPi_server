/* global __base */
var ServicesMiddleware = require(__base + "middleware/ServicesMiddleware");
var ServicesManager = require(__base + "modules/ServicesManager");
module.exports = function (app) {
    var userMiddleware = require(__base + "middleware/user");
    app.get("/api/services", userMiddleware.isLoggedIn, ServicesMiddleware.getAll);
    app.get("/api/services/:name/login", userMiddleware.isLoggedIn, ServicesManager.login);

    app.get("/api/services/:name/user", userMiddleware.isLoggedIn, ServicesManager.getUser);
};
