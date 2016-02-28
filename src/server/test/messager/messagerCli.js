var mqtt    = require('mqtt');
var client  = mqtt.connect('tcp://localhost:3005');
var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

var pi = "default";
rl.setPrompt(pi+'> ');


client.on("connect", function() {
	rl.prompt();

	rl.on('line', function(line) {
	    handleLine(line);
	    rl.prompt();
	}).on('close', function() {
	    console.log('Have a great day!');
	    process.exit(0);
	});
})


function handleLine(line) {
	var re = /(.*)\(([^,]+)(?:,(.+))?\)/g
	var res = re.exec(line.trim());
	res.shift();
	if (res.length > 0) {
		switch(res[0]) {
			case "subscribe":
				if (res[1]) {
					console.log("subscribing to " + res[1]);
					client.subscribe("client:" + res[1]);
					pi = res[1];
					rl.setPrompt(pi+'> ');
				}
				return;
			case "emit":
				if (res[1]) {
						var param = res[1].split(",");
						console.log("emitting '" + res[1] + "'");
						var message = {
							event: res[1]
						}
						if (res[2]) {
							try {
								message.data = JSON.parse(res[2])
							} catch(e) {
								console.log(e);
								message.data = res[2];
							}
						}
						client.publish("raspberry:" + pi, JSON.stringify(message));
				
				}
				return;

		}
	}
}

/*
//rl.question("use raspberry: ", function(pi) {
	console.log("connecting...");
	client.on('connect', function () {
		console.log("subscribe to " + "client:" + pi);
		//client.subscribe("client:" + pi);
		//console.log("connected");
		talk(pi);
	});
//});*/

/*
function talk(pi) {
	getEvent(pi, function(event) {
		if (event == "stop") {
			rl.close();
			client.close();
			return;
		}
		client.publish("raspberry:" + pi, JSON.stringify({
			event: event
		}));
	})

}

function getEvent(pi, callback) {
	rl.question(pi+">", callback);
}
*/




/*
client.on('connect', function () {
	console.log("connected");
	client.subscribe("client:" + name);
	console.log("resuming player");
	client.publish("raspberry:" + name, JSON.stringify({
		event: "player:pause"
	}));
});

client.on('message', function (topic, message) {
	console.log("new message : " + message.toString());

});
*/


