#!/usr/bin/env node
var config = require("./data/public/config");

var env = require("node-env-file");
try {
    env(".env");
} catch (e) {
    console.log(e);
    console.log("unable to get env file");
}

require("babel-core/register")({
    ignore: function(filename) {
        for(var key in config.modules) {
            if (filename.indexOf("node_modules") === -1 ||
                filename.indexOf("node_modules/" + key) !== -1 &&
                filename.indexOf("node_modules/" + key + "/node_modules") === -1) {
                return false;
            }
        }
        return true;
    },
    "presets": ["es2015", "stage-0"],
    "plugins": ["transform-object-rest-spread", "transform-es2015-destructuring"]
});
var program = require('commander');
var path = require("path");

program
  .version('0.0.1')
  .option('-t, --test [path]', 'run test')
  .parse(process.argv);

if (!program.test)
    require("./app");
else {
    console.log(path.join("./test/", program.test));
    require("./" + path.join("test/", program.test));
}
