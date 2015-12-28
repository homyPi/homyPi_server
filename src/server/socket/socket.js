/**
 * Created by nolitsou on 9/6/15.
 */
var socketioJwt = require("socketio-jwt");
var config = require(__base + "data/private/config.js");

var raspberrySocket = require("./raspberrySocket");

var ModuleManager = require("../modules/ModuleManager");
var Raspberry  = require(__base + "models/Raspberry");

var IO = function() {};

IO.init = function(server) {
	console.log("initializing socket.io");
	IO.io = require('socket.io')(server, {origins:'*:*'});
	IO.io.use(socketioJwt.authorize({
		secret: config.jwtSecret,
		handshake: true
	}));
	IO.io.on('connection', function(socket){
		console.log("new client connected");
		console.log(socket.decoded_token);
		if (socket.decoded_token.isRaspberry) {
			console.log("client is raspberry!!");
			var info = {};
			try {
				if (socket.handshake.query &&
					socket.handshake.query.info)
					info = JSON.parse(socket.handshake.query.info);
			} catch(e) {
				socket.disconnect();
				return;
			}
			Raspberry.start(info.name, info.ip, socket.id)
				.then(function(raspberry) {
					socket.raspberryInfo = info;
					console.log("new raspberry:");
					console.log(JSON.stringify(raspberry))
					socket.broadcast.emit("raspberry:new", {raspberry: raspberry});
				}).catch(function(err) {
					console.log(err);
					if (err.code === 404) {
						socket.disconnect();
					}
				});

		}
		socket.on('ping', function(){
			console.log("ping:received")
			socket.emit("ping:received");
		});
		raspberrySocket(socket);
		
		ModuleManager.setUpSocket(socket, IO.io);
		socket.on('disconnect', function(){
			console.log("client disconnected");
			if (socket.decoded_token.isRaspberry
				&& socket.raspberryInfo) {
				Raspberry.stop(socket.raspberryInfo.name)
				.then(function(raspberry) {
					console.log(JSON.stringify(raspberry))
				}).catch(function(err) {
					console.log(err);
				});
				socket.broadcast.emit("raspberry:remove", {name: socket.raspberryInfo.name});
			}
		});
	});
	return IO.io;
};

module.exports = IO;
