import mqtt from "mqtt";
import Promise from "bluebird";

import path from "path";

class MqttClient {
    constructor(url, token) {
        this.url = url;
        this.token = token;
        this.client = null;

        this.events = [];
    }

    connect() {
        return new Promise((resolve) => {
            this.client = mqtt.connect(path.join(this.url, "/?clientId=" + this.token));
            this.client.on("connect", function () {
                resolve();
            });

            this.client.on("message", this.onMessage);
        });
    }
    on(topic, callback) {
        // convert mqtt wildcart into regex
        var parsed = topic.replace(/\+/g, "[^/]*").replace(/#/g, ".*");
        this.events.push({re: new RegExp("^" + parsed + "$"), callback});
    }
    onMessage(topic, payload) {
        this.events.forEach(event => {
            if (topic.match(event.re)) event.callback(topic, payload);
        });
    }
}

export default MqttClient;
