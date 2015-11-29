var fs = require('fs');
var gulp = require('gulp');
var child_process = require("child_process");

var configFile = "../../../src/server/data/public/config.json";
var outFile = "./src/public/src/js/modules.js";

var havePublicModule = function(module) {
	try {
		require(module + "/public");
		return true;
	} catch (e) {
		if (e.code === "MODULE_NOT_FOUND") {
			console.log("module: " + module, e);
			return false;
		}
		return true;
	}
}


gulp.task('modules', function(callback){
	var config = require(configFile);
	var out = 	"module.exports = [\n";
	for(var module in config.modules) {
		if (havePublicModule(module)) {
			out += "    require('" + module + "/public'),\n";
		}
	}
	out += "];"
	console.log(out);
	child_process.exec("touch " + outFile,
  function (error, stdout, stderr) {
	    if (error !== null) {
	      console.log('exec error: ' + error);
	      callback(error);
	    } else {
	  		fs.writeFileSync(outFile, out);
	  		callback();
	    }
	});
});