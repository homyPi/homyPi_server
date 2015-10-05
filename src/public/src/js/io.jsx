import io from "socket.io-client";
var socket;

export default {
	connect(token) {
		console.log("connecting to socketIo");
		this.socket = io.connect("localhost:3000", {
    		query: 'token=' + token
  		});
  		this.socket.on("connect", function() {
  			console.log("connected");
  		});
	},
	socket: socket
}