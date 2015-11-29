var spawn = require('child_process').spawn
var config = require("./src/server/data/public/config.json");
console.log(JSON.stringify(config, null, 2));

for (var module in config.modules) {
	try {
		require(module);
	} catch(e) {
		if (config.modules[module].package) {
			spawn("npm", [config.modules[module].package]);
		} else {
			spawn("npm", [module]);
		}
	}
}