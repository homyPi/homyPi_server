"use strict";
global.__base = __dirname + "/";
global.__modules = __dirname + "/modules/";


import MqttServer from "./modules/mqttServer";
import setEvents from "./socket/events";

var config = require("./data/private/config.js");
var express = require("express");
var routes = require("./routes");

var ModuleManager = require("./modules/ModuleManager");
ModuleManager.init();

require("./models/mongoose/mongoose-schema.js")(ModuleManager);
require("./models/mongoose/mongoose-models.js");

// var Raspberry = require("./models/Raspberry");

require("./models/mongoose/mongoose-connection")(config, function () {

});

var winston = require("winston");
var expressWinston = require("express-winston");
var bodyParser = require("body-parser");
var bearerToken = require("express-bearer-token");
var jwt = require("jwt-simple");
var path = require("path");

var userModel = require(__base + "models/mongoose/mongoose-models").User;

var app = express();



var server = require("http").createServer(app);
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE");
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization, Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
app.use(express.static(path.join(__dirname, "../public/dist")));
app.use(express.static(path.join(__dirname, "../../node_modules")));
app.use(bearerToken());
app.use(bodyParser());
app.use(function(req, res, next) {
    req.user = null;
    var user = null;
    try {
        user = jwt.decode(req.token, config.jwtSecret);
    } catch (e) {
        return next();
    }
    console.log("get user");
    userModel.findOne({username: user.username}, function (err, userInfo) {
        console.log("got user");
        req.user = userInfo;
        return next();
    });
});


app.use(expressWinston.logger({
    transports: [new winston.transports.Console({
        json: true,
        colorize: true
    })],
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorStatus: true,
    ignoreRoute: function ignoreRoute(req, res) {
        return false;
    }
}));

process.messager = new MqttServer(server);
setEvents(process.messager);
process.messager.start().then(()=> console.log("started"));

ModuleManager.load(process.messager).then(function() {
    routes(app, server);
    app.get("*", function (req, res, next) {
        var err = {};
        err.status = 404;
        next(err);
    });

    // handling 404 errors
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        if (err.status !== 404) {
            return next();
        }
        res.status(404)
        res.json(err);
    });
    // handling 500 errors
    app.use(function (err, req, res, next) {
        console.error(err.stack);
        if(err.status !== 500) {
            return next();
        }
        res.status(500);
    });
    //Raspberry.stopAll();
    server.listen(process.env.PORT || 3000, function () {

        var host = server.address().address;
        var port = server.address().port;
        console.log("Example app listening at http://%s:%s", host, port);
    });
})
