var fs = require("fs");
var readline = require('readline');
var colors = require('colors');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var configKeys = require("./config.js").configKeys;
var ArgumentParser = require('argparse').ArgumentParser;
var parser = new ArgumentParser({
    version : '0.0.1',
    addHelp : true,
    description : ''
});
parser.addArgument(['-a', '--all'], {
    help : "Set all arguments",
    action: "storeTrue"
});
parser.addArgument(['-c', '--configure'], {
    help : "Set all arguments",
    action: "append"
});
parser.addArgument(['-l', '--list'], {
    help : "names of the modules to launch (comma separated)",
    action: "storeTrue"
});

var args = parser.parseArgs();
var configFile = "./.env";
if (!args.all && args.configure) {
	var mapped = [];
	for (var i = 0; i < args.configure.length; i++) {
		mapped.push(args.configure[i].split(","));
	}
	args.configure = [];
	for (var i = 0; i < mapped.length; i++) {
		args.configure = args.configure.concat(mapped[i]);
	}
} else if (!args.all && !args.list) {
	console.error("missing parameters");
	process.exit();
}

var configs = (fs.readFileSync(configFile).toString().split("\n"))
	.filter(function(line) {
	var c;
	if (line && line.trim() != "") {
		c= line.split("=");
		if (c && c.length === 2) {
			return true;
		}
	}
	}).map(function(line) {
		var c = line.split("=");
		return {key: c[0], value: c[1]};
	});
var exists = false;
for (var i = 0; i < configKeys.length; i++) {
	exists = false
	for (var j = 0; j < configs.length; j++) {
		if (configKeys[i] === configs[j].key) {
			exists = true;
			break;
		}
	}
	if (!exists) {
		console.log("Adding key " + configKeys[i]);
		configs.push({key: configKeys[i], value: ""});
	}
}
if (args.list) {
	console.log(JSON.stringify(configs, null, 2));
}

if (args.all) {
	args.configure = configs.map(function(item) {
		return item.key;
	});
}

function handle() {
	var item = args.configure.pop();
	if (!item) {
		return done();
	} else {
		configure(item, function() {
			handle();
		});
	}
}
if (args.configure) {
	console.log("");
	console.log("\tInput '" + "null".red + "' to let a value empty");
	console.log("");
	handle();
}
function configure(name, callback) {
	var index = -1;
	for (var i = 0; i < configs.length; i++) {
		if (configs[i].key === name) {
			index = i;
			break;
		}
	}
	if (index === -1) {
		configs.push({key: name, value: ""});
		index = configs.length -1;
	}
	getInput(configs[i].key, configs[i].value, function(value) {
		configs[i].value = value;
		callback();
	});
}

function getInput(name, defaultValue, callback) {
	if (!defaultValue) defaultValue = "";
	rl.question(name.bold + " (default: '" + defaultValue.green + "'): ", function(answer) {
		if (answer === "") answer = defaultValue;
		if (answer === "null") answer = "";
		callback(answer);
	});

}

function exportConfig(callback) {
	var str = "";
	str = configs.map(function(item) {
		return item.key + "=" + item.value;
	}).join("\n");
	fs.writeFile(configFile, str, 'utf8', callback);
}

function done() {

	console.log("finally");
	exportConfig(function() {
		process.exit();
	});
}
