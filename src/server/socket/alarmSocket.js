/**
 * Created by nolitsou on 9/8/15.
 */
var Alarm  = require(__base + "models/Alarm");

module.exports = function(socket) {
	socket.on("alarms:get", function(request) {
		console.log(request);
		if (!request) {
			Alarm.getAll()
				.then(function(alarms) {
					socket.emit("alarms:update", {alarms: alarms});
				}).catch(function(error) {
					socket.emit("error", {err: error});
				});
		}
	})

};