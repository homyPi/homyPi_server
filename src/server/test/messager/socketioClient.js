/*

var io = require("socket.io-client");

var socket = io.connect('http://localhost:3000');

socket.on("connect", function() {
	console.log("connected");
	socket.emit("join", "rasp1");
	socket.emit("hello", {data: 5});
});


socket.on("status", function(data) {
	console.log("got status with " + data);
})

*/