'use strict';
global.__base = __dirname + "/";
global.__modules = __dirname + "/modules/";

var env = require('node-env-file');
try {
	env(".env");
} catch(e) {
	console.log(e);
	console.log("unable to get env file");
}

var express = require('express');
var routes = require("./routes");
var schema = require('./models/mongoose/mongoose-schema.js')();
var models = require('./models/mongoose/mongoose-models.js');
var connection = require('./models/mongoose/mongoose-connection')();
var winston = require('winston');
var expressWinston = require('express-winston');
var bodyParser = require('body-parser');
var bearerToken = require('express-bearer-token');
var config = require("./data/private/config.js");
var jwt = require("jwt-simple");
var path = require("path");

var app = express();

var ModuleManager = require("./modules/ModuleManager");
ModuleManager.load();

var server = require('http').createServer(app);
app.use(express.static(path.join(__dirname, '../public/dist')));
app.use(express.static(path.join(__dirname, '../../node_modules')));
app.use(bearerToken());
app.use(bodyParser());
app.use(function(req, res, next) {
	req.user = null;
	try {
		req.user = jwt.decode(req.token, config.jwtSecret);
		return next();
	} catch(e) {
		return next();
	}
});

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization, Content-Type");
    next();
});

app.use(expressWinston.logger({
	transports: [new winston.transports.Console({
		json: true,
		colorize: true
	})],
	meta: true, // optional: control whether you want to log the meta data about the request (default to true)
	msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
	expressFormat: true, // Use the default Express/morgan request formatting, with the same colors. Enabling this will override any msg and colorStatus if true. Will only output colors on transports with colorize set to true
	colorStatus: true, // Color the status code, using the Express/morgan color palette (default green, 3XX cyan, 4XX yellow, 5XX red). Will not be recognized if expressFormat is true
	ignoreRoute: function ignoreRoute(req, res) {
		return false;
	} // optional: allows to skip some log messages based on request and/or response
}));

app.use(function (err, req, res, next) {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});
var socket = require("./socket/socket");

routes(app);
process.io = socket.init(server);

server.listen(process.env.PORT || 3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('Example app listening at http://%s:%s', host, port);
});
