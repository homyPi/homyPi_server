global.__base = __dirname + "/../";
var should = require("should");
var config = require("../data/private/config");

describe('spotify', function() {
	if(config.spotify_config) {
		it("connect", function(done) {
			done();
		});
	} else {
		console.error("Missing spotify configuration");
	}
});