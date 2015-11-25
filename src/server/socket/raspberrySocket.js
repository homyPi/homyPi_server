var Raspberry  = require(__base + "models/Raspberry");


module.exports = function(socket) {
	socket.on('raspberry:module:new', function(data){
		if (!socket.raspberryInfo || !socket.raspberryInfo.name) return;
		console.log('raspberry:module:new...');
		Raspberry.moduleStarted(socket.raspberryInfo.name, data)
			.then(function(raspberry, module) {
				console.log("DONE");
				socket.broadcast.emit("raspberry:module:new", module);
			}).catch(function(err) {
				console.log(err);
			});
	});
};