var env = require('node-env-file');
try {
	env(".env");
} catch(e) {
	console.log(e);
	console.log("unable to get env file");
}