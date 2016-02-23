var mqtt    = require('mqtt');
var client  = mqtt.connect('mqtt://localhost:3005');

var name = "rasp1";

client.on('connect', function () {
	console.log("connected");
	client.subscribe(name);
});

client.on('message', function (topic, message) {
	console.log("new message : " + message.toString());
	client.publish(name+":client", JSON.stringify({event: "status"}));
	client.publish(name+":client", JSON.stringify({event: "status", data: "pretty good..."}));
});
