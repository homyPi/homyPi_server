var env = require('node-env-file');
try {
	env(".env");
} catch(e) {
	console.log("no env file");
}