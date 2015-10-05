/**
 * Created by nolitsou on 9/6/15.
 */
var socketioJwt = require("socketio-jwt");
var config = require(__base + "data/private/config.json");

var alarmSocket = require("./alarmSocket");
var playerSocket = require("./playerSocket");
var raspberrySocket = require("./raspberrySocket");

var Raspberry  = require(__base + "models/Raspberry");

var IO = function() {};

IO.init = function(server) {
	console.log("initializing socket.io");
	IO.io = require('socket.io')(server);
	IO.io.use(socketioJwt.authorize({
		secret: config.jwtSecret,
		handshake: true
	}));
	IO.io.on('connection', function(socket){
		console.log("new client connected");
		console.log(socket.decoded_token);
		if (socket.decoded_token.isRaspberry) {
			console.log("client is raspberry!!");
			var rasp = new Raspberry(socket.decoded_token._id, socket.id);
			Raspberry.connectedClients.push(rasp);
			socket.broadcast.emit("raspberry:new", {raspberry: rasp.get()});

		}
		socket.on('ping', function(){
			socket.emit("ping:received");
		});
		alarmSocket(socket);
		playerSocket(socket);
		raspberrySocket(socket);
		socket.on('disconnect', function(){
			if (socket.decoded_token.isRaspberry) {
				console.log("it's a pie!!");
				for(var i = 0; i < Raspberry.connectedClients.length; i++) {
					if (socket.id ===  Raspberry.connectedClients[i].socketId) {
						 Raspberry.connectedClients.splice(i, 1);
				console.log("'t was a lie!!'");
						 socket.broadcast.emit("raspberry:remove", {socketId: socket.id});
					}
				}
			}
		});
	});
	return IO.io;
};

module.exports = IO;