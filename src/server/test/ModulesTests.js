/* global describe */
/* global it */
/* global before */

var mongoose = require("mongoose");
var Schema = mongoose.Schema;
import should from "should";    // eslint-disable-line no-unused-vars
var ModuleManager = require("../modules/ModuleManager");
var schema = {};    // eslint-disable-line no-unused-vars
var models = {};

const TestModules = {
    dependencyTest: {
        directory: __dirname + "/testModules/dependencyTest"
    },
    moduleSimple: {
        directory: __dirname + "/testModules/moduleSimple"
    },
    withShared: {
        directory: __dirname + "/testModules/withShared"
    },
    externalsSchema: {
        directory: __dirname + "/testModules/externalsSchema"
    }
};

describe("modulesManager", () => {
    before((done) => {
        ModuleManager.init(TestModules);

        schema = require("../models/mongoose/mongoose-schema.js")(ModuleManager);
        models = require("../models/mongoose/mongoose-models.js");
        done();
    });

    it("check dependencies order", (done) => {
        console.log(TestModules);
        ModuleManager.order.should.be.instanceof(Array)
          .and.have.lengthOf(Object.keys(TestModules).length);
        ModuleManager.order[0].should.equal("moduleSimple");
        ModuleManager.order[1].should.equal("dependencyTest");
        done();
    });

    it("schema is set", function (done) {
        models.should.have.property("simpleTestSchema");
        models.simpleTestSchema.should.have.property("schema");
        models.simpleTestSchema.schema.should.have.property("paths");
        models.simpleTestSchema.schema.paths.should.have.property("cats");
        models.simpleTestSchema.schema.paths.should.have.property("dogs");
        models.simpleTestSchema.schema.paths.cats.should.be.an.instanceOf(Schema.Types.Mixed);
        done();
    });
    it("Externals should works", function (done) {
        models.should.not.have.property("shouldNotBeCreated");
        models.should.have.property("simpleTestSchema");
        models.simpleTestSchema.schema.should.have.property("tree");
        /* eslint-disable */
        models.simpleTestSchema.schema.tree.should.have.property("cats")
          .and.be.an.Object;
        /* eslint-enable */
        models.simpleTestSchema.schema.tree.should.have.property("dogs");
        models.simpleTestSchema.schema.tree.should.have.property("externals");
        models.simpleTestSchema.schema.tree.externals.should.have.property("shouldBeCreatedOne");
        models.simpleTestSchema.schema.tree.externals.should.have.property("shouldBeCreatedTwo");
        models.simpleTestSchema.schema.tree.externals.should.have.property("inDouble");
        /*
        models.should.have.property("shouldBeCreatedOne");
        models.should.have.property("shouldBeCreatedTwo");*/
        done();
    });

    it("modules shared functions", function (done) {
        ModuleManager.load()
          .then(() => {
              console.log("::");
              ModuleManager.Shared.modules.should.have.property("withShared");
              ModuleManager.Shared.modules.withShared.should.have.property("superUsefull");
              /* eslint-disable no-unused-expressions */
              ModuleManager.Shared.modules.withShared.superUsefull
                .should.be.a.Function;
              /* eslint-enable no-unused-expressions */
              ModuleManager.Shared.modules.withShared.superUsefull().should.be
                .equal("There's always time for a nice cup of tea");

              done();
          }).catch((err) => {
              done(err);
          });
    });
});
