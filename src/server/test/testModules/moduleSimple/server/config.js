var mongoose = require("mongoose");
var Schema = mongoose.Schema;
module.exports = {
	"path": "simpleTest",
	"require": [],
	"schemas": {
		simpleTestSchema: {
			cats: Schema.Types.Mixed,
			dogs: Number
		}
	}
};
