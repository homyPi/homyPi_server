import io from "socket.io-client";
import config from "./config.js";

import RaspberryActionCreators from "./actions/RaspberryActionCreators.jsx";

import ModuleManager from './ModuleManager.jsx';

var serverUrl = config.server_url || "";
var socket;

export default {
	connect(token) {
		console.log("connecting to socketIo");
		this.socket = io.connect(serverUrl + "/", {
    		query: 'token=' + token
  		});
      ModuleManager.setSocket(this.socket);
  		this.socket.on("connect", function() {
  			console.log("connected");
  		});
  		this.socket.on("raspberry:new", function(data) {
  			RaspberryActionCreators.newRaspberry(data.raspberry);
  		});
  		this.socket.on("raspberry:module:new", function(data) {
  			//RaspberryActionCreators.newModule(data);
  		});
	},
	socket: socket
}
