import io from "socket.io-client";
import config from "./config.js";
var serverUrl = config.server_url || "";
var socket;

export default {
	connect(token) {
		console.log("connecting to socketIo");
		this.socket = io.connect(serverUrl + "/", {
    		query: 'token=' + token
  		});
  		this.socket.on("connect", function() {
  			console.log("connected");
  		});
	},
	socket: socket
}
