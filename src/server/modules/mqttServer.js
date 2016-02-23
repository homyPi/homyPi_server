//import mosca from "mosca";
/*
import socketIO from "socket.io";
var ioWildcard = require("socketio-wildcard")();
*/
import Promise from "bluebird";
import mosca from "mosca";
import Raspberry from "../models/Raspberry";


class MqttServer {
	constructor(server) {
		this.mqtt = new mosca.Server({
			port:3005
		});
		this.mqtt.attachHttpServer(server);
		this.events = {};
		this.clientEvents = {};
		this.raspberryEvents = {};
		this.mqtt.on('subscribed', (topic, client) => {
			console.log("New client subscribing to " + topic);
			var info = topic.split(":");	//[raspberry/client]:[raspberryName]
			if (info.length === 2) {
				if (info[0] === "raspberry") {
					Raspberry.start(info[1], null, null)
						.then(raspberry => {
							//socket.raspberryInfo = info;
							console.log("new raspberry:");
							console.log(JSON.stringify(raspberry))
							this.emit(undefined, "raspberry:state:up", {raspberry: raspberry})
								.then(() => console.log("clients notified"));
						}).catch(function(err) {
							console.log(err);
							if (err.code === 404) {
								client.close();
							}
						});
				}
			}
		});
		this.mqtt.on('clientConnected', function(client) {
		    console.log('client connected', client.id);
		});
		this.mqtt.on('unsubscribed', (topic, client) => {
			console.log(" client unsubscribing from " + topic);
			var info = topic.split(":");	//[raspberry/client]:[raspberryName]
			if (info.length === 2) {
				if (info[0] === "raspberry") {
					Raspberry.stop(info[1])
						.then(function() {})
						.catch(function(err) {console.log(err)})
					this.emit(undefined, "raspberry:state:down", {name: info[1]})
						.then(() => console.log("clients notified"));
				}
			}
		});
		this.mqtt.on("published", packet => {
			try {
				let {event, data} = JSON.parse(packet.payload.toString());
				var topic = packet.topic;
				if (this.events[event]) {
					this.events[event].forEach(fn => fn(data, this.getTopicInfo(topic)));
				}
			} catch(e) {
				console.log("unable to parse " + packet.payload.toString());
				console.log(e);
			}
		});
	}
	getTopicInfo(topic) {
		var info = topic.split(":");
		var reqInfo = {};
		if (info.length < 2) return {};
		if (info[0] === "raspberry" || info[0] === "client") {
			reqInfo.source = info[0];
			reqInfo.raspberry = info[1];
		}
		return reqInfo;
	}
	emit(topic="default", event, data) {
		return new Promise((resolve, reject) => {
			var message = {
				topic: topic,
				payload: JSON.stringify({event: event, data: data}),
				qos: 0, // 0, 1, or 2
				retain: false // or true
			};
			this.mqtt.publish(message, resolve);
		});
	}
	on(event, callback) {
		if (!this.events[event])
			this.events[event] = [];
		console.log("new callback for " + event);
		this.events[event].push(callback);
	}
	onClient(event, callback) {

	}
	onRaspberry(event, callback) {

	}
	start() {
		return new Promise((resolve, reject) => {
			this.mqtt.on('ready',() => {

				console.log('Mosca server is up and running on port ' + this.getPort());
				console.log((this.mqtt.opts));
				resolve();
			});
		});
	}
	getPort() {
		if (this.mqtt && this.mqtt.opts)
			return this.mqtt.opts.port
		return null;
	}
}
export default MqttServer;