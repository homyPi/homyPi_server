var env = require("node-env-file");
global.__base = __dirname + "/../";
try {
    env(".env");
} catch (e) {
    console.log(e);
    console.log("unable to get env file");
}
