import mosca from "mosca";
import socketIO from "socket.io";
var ioWildcard = require("socketio-wildcard")();
import Promise from "bluebird";


/*
class Messager {
	constructor(server) {
		this.io = socketIO(server, {origins:'*:*'});
		this.mqtt = new mosca.Server({
			port: 3005
		});
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log('Mosca server is up and running');
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
		this.mqtt.on('ready', () => {
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log('Mosca server is up and running');
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				//resolve();
			});
		this.io.use(ioWildcard);
		console.log("waiting for new clients");
		this.io.on("connection", socket => {
			console.log("new client");
			socket.on("*", (data) => {
				if (socket.rooms.length < 2)
					return;
				console.log(data);
				this.mqtt.publish({
					topic: socket.rooms[1],
					payload: JSON.stringify({"event": data.data[0], data: data.data[1]}),
					qos: 0,
					retain: false
				});
			})
			socket.on("join", function(room) {
				socket.join(room);
				socket.join(room+":client");
			});
			console.log(socket._events);
		});
		this.mqtt.on("published", packet => {
			try {
				var json = JSON.parse(packet.payload.toString());
				console.log("to topic ", packet.topic, json);
				this.io.to(packet.topic).emit(json.event, json.data);
			} catch(e) {}
		});


	}
	start() {
		return new Promise((resolve, reject) => {
			this.mqtt.on('ready', () => {
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log('Mosca server is up and running');
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
				resolve();
			});
		});
	}
}

Messager.EVENTS = {
	EVENT_CONNECTION: {
		socketio: "connection",
		mqtt: "clientConnected"
	}
}

export default Messager;*/