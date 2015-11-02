var socket = require("./socket/socket");
var GCM = require("./GCM");

var SocketsManager = function() {
	"use strict";
}
SocketsManager.sockets = [];
SocketsManager.init = function(server) {
	SocketsManager.sockets.push(io.init(server));
	var gcm = GCM.ini(server);

	if (gcm) {
		SocketsManager.sockets.push(gcm);
	}
}

module.exports = SocketsManager;