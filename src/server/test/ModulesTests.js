
global.__base = __dirname + "/../";
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var should = require("should");
var ModuleManager = require("../modules/ModuleManager");
var schema = {};
var models = {};
describe('modulesManager', function() {
	before(function(done) {
		ModuleManager.init(["dependencyTest", "moduleSimple"], {
			dependencyTest: require("./testModules/dependencyTest/server/config"),
			moduleSimple: require("./testModules/moduleSimple/server/config")
		});
		schema = require('../models/mongoose/mongoose-schema.js')(ModuleManager);
		models = require('../models/mongoose/mongoose-models.js');
		done();
	});

	it("check dependencies order", function(done) {
		ModuleManager.order.should.be.instanceof(Array).and.have.lengthOf(2);
		ModuleManager.order[0].should.equal("moduleSimple");
		ModuleManager.order[1].should.equal("dependencyTest");
		done();
	});

	it("schema is set", function(done) {
		models.should.have.property("simpleTestSchema");
		models.simpleTestSchema.should.have.property("schema");
		models.simpleTestSchema.schema.should.have.property("paths");
		models.simpleTestSchema.schema.paths.should.have.property("cats");
		models.simpleTestSchema.schema.paths.should.have.property("dogs");
		models.simpleTestSchema.schema.paths.cats.should.be.an.instanceOf(Schema.Types.Mixed);
		done();
	});

});



