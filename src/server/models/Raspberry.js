
Raspberry = function(_id, socketId, playerStatus) {
	"use strict";
	this._id = _id;
	this.socketId = socketId;

	this.playerStatus = playerStatus || Raspberry.status.PAUSED;

	this.get = function() {
		return {
			_id: this._id,
			socketId: this.socketId,
			status: this.playerStatus
		}
	}
}
Raspberry.connectedClients = [];

Raspberry.status = {
	PLAYING: "PLAYING",
	PAUSED: "PAUSED"
}

module.exports = Raspberry;