/* global describe */
/* global it */
/* global before */
/* eslint max-nested-callbacks:[1, 5] */

import startMongoose from "./mocks/mongoose";

import Raspberry from "../models/Raspberry";
import {Raspberry as raspberryModel} from "../models/mongoose/mongoose-models";

import {expect} from "chai";

describe("Raspberries", function () {
    before(done => {
        startMongoose()
        .then(() => {
            done();
        }).catch(done);
    });

    it("Add raspberry without module", (done) => {
        var RASPBERRY_TEST_NAME = "hello";
        Raspberry.add(RASPBERRY_TEST_NAME)
          .then(function (data) {
              console.log(data);
              raspberryModel.find({name: RASPBERRY_TEST_NAME},
                function (err, raspberry) {
                    if (err) return done(err);
                    expect(raspberry).to.be.an("Array").with.length(1);
                    done();
                });
          }).catch(function (error) {
              done(error);
          });
    });
    it("Add raspberry with module", (done) => {
        var RASPBERRY_TEST_NAME = "hello_modules";
        Raspberry.add(RASPBERRY_TEST_NAME, ["module1", "module2"])
          .then(function () {
              raspberryModel.find({name: RASPBERRY_TEST_NAME},
                function (err, raspberry) {
                    if (err) return done(err);
                    expect(raspberry).to.be.an("Array").with.length(1);
                    expect(raspberry[0]).to.have.property("modules")
                    expect(raspberry[0].modules).to.be.an("Array").with.length(2);
                    expect(raspberry[0].modules[0]).to.have.property("name", "module1");
                    expect(raspberry[0].modules[0]).to.have.property("state", "DOWN");
                    expect(raspberry[0].modules[1]).to.have.property("name", "module2");
                    expect(raspberry[0].modules[1]).to.have.property("state", "DOWN");
                    return done();
                });
          }).catch(function (error) {
              done(error);
          });
    });
    it("Cannot add two raspberries with the same name", (done) => {
        var RASPBERRY_TEST_NAME = "hello2";
        Raspberry.add(RASPBERRY_TEST_NAME)
          .then(function () {
              Raspberry.add(RASPBERRY_TEST_NAME)
                .then(function () {
                    done(new Error("should no pass"));
                }).catch(err => {
                    console.log("==>", err);
                    expect(err).to.have.property("code", 10);
                    expect(err).to.have.property("id", "RASPBERRY_NAME_EXISTS");
                    done();
                });
          }).catch(function (error) {
              done(error);
          });
    });

    it("Find an existing raspberry", (done) => {
        var RASPBERRY_TEST_NAME = "hello3";
        Raspberry.add("hello3", ["module1", "module2"])
          .then(() => {
              return Raspberry.findOne(RASPBERRY_TEST_NAME);
          }).then(function (raspberry) {
              expect(raspberry).to.have.property("name", RASPBERRY_TEST_NAME);
              expect(raspberry.modules[0]).to.have.property("name", "module1");
              expect(raspberry.modules[0]).to.have.property("state", "DOWN");
              expect(raspberry.modules[1]).to.have.property("name", "module2");
              expect(raspberry.modules[1]).to.have.property("state", "DOWN");
              done();
          }).catch(function (error) {
              done(new Error(JSON.stringify(error)));
          });
    });

    it("Trying to find a none existing raspberry", (done) => {
        var RASPBERRY_TEST_NAME = "should not exist";
        Raspberry.findOne(RASPBERRY_TEST_NAME)
            .then(function () {
                done(new Error("should not succeed"));
            }).catch(function (error) {
                expect(error).to.have.property("code", 404);
                expect(error).to.have.property("id", "RASPBERRY_NOT_FOUND");
                done();
            });
    });

    it("Start existing raspberry", (done) => {
        var RASPBERRY_TEST_NAME = "testStart";
        Raspberry.add(RASPBERRY_TEST_NAME)
            .then(function () {
                return Raspberry.start(RASPBERRY_TEST_NAME);
            }).then(function() {
                return Raspberry.findOne(RASPBERRY_TEST_NAME);
            }).then(function (rasp) {
                expect(rasp).to.have.property("state", "UP");
                done();
            }).catch(function (error) {
                done(JSON.stringify(error));
            });
    });
    it("Start non existing raspberry", (done) => {
        var RASPBERRY_TEST_NAME = "testStartNoneExisting";
        Raspberry.start(RASPBERRY_TEST_NAME)
          .then(function() {
              done(new Error("should not exist"))
          }).catch(function (error) {
              expect(error).to.have.property("code", 404);
              expect(error).to.have.property("id", "RASPBERRY_NOT_FOUND");
              done();
          });
    });

    it("Stop existing raspberry", (done) => {
        var RASPBERRY_TEST_NAME = "testStop";
        Raspberry.add(RASPBERRY_TEST_NAME)
            .then(function () {
                return Raspberry.start(RASPBERRY_TEST_NAME);
            }).then(function() {
                return Raspberry.findOne(RASPBERRY_TEST_NAME);
            }).then(function (rasp) {
                expect(rasp).to.have.property("state", "UP");
                return Raspberry.stop(RASPBERRY_TEST_NAME);
            }).then(function (rasp) {
                expect(rasp).to.have.property("state", "DOWN");
                done();
            }).catch(function (error) {
                done(JSON.stringify(error));
            });
    });
    it("Find all", (done) => {
        var RASPBERRY_TEST_NAME_1 = "getAll1";
        var RASPBERRY_TEST_NAME_2 = "getAll3";
        var RASPBERRY_TEST_NAME_3 = "getAll2";
        raspberryModel.remove({}, function (err) {
            if (err) return done(err);
            return Raspberry.add(RASPBERRY_TEST_NAME_1)
                .then(function () {
                    return Raspberry.add(RASPBERRY_TEST_NAME_2);
                }).then(function () {
                    return Raspberry.add(RASPBERRY_TEST_NAME_3);
                }).then(function () {
                    return Raspberry.getAll();
                }).then(function (list) {
                    expect(list).to.be.an("Array").with.length(3);
                    expect(list[0]).to.have.property("name", RASPBERRY_TEST_NAME_1);
                    expect(list[1]).to.have.property("name", RASPBERRY_TEST_NAME_2);
                    expect(list[2]).to.have.property("name", RASPBERRY_TEST_NAME_3);
                    done();
                }).catch(function (error) {
                    done(JSON.stringify(error));
                });
        });
    });
    it("Stop all", (done) => {
        var RASPBERRY_TEST_NAME_1 = "getAll1";
        var RASPBERRY_TEST_NAME_2 = "getAll2";
        var RASPBERRY_TEST_NAME_3 = "getAll3";
        raspberryModel.remove({}, function (err) {
            if (err) return done(err);
            return Raspberry.add(RASPBERRY_TEST_NAME_1, ["module1"])
                .then(function () {
                    return Raspberry.add(RASPBERRY_TEST_NAME_2);
                }).then(function () {
                    return Raspberry.add(RASPBERRY_TEST_NAME_3);
                }).then(function () {
                    return Raspberry.start(RASPBERRY_TEST_NAME_1);
                }).then(function () {
                    return Raspberry.start(RASPBERRY_TEST_NAME_2);
                }).then(function () {
                    return Raspberry.getAll();
                }).then(function (list) {
                    expect(list).to.be.an("Array").with.length(3);
                    expect(list[0]).to.have.property("name", RASPBERRY_TEST_NAME_1);
                    expect(list[0]).to.have.property("state", "UP");
                    expect(list[1]).to.have.property("name", RASPBERRY_TEST_NAME_2);
                    expect(list[1]).to.have.property("state", "UP");
                    console.log(JSON.stringify(list[2], null, 2));
                    expect(list[2]).to.have.property("name", RASPBERRY_TEST_NAME_3);

                    return Raspberry.stopAll();
                }).then(function () {
                    console.log("$$$$$$$$$$$$$$$$$$$$");
                    return Raspberry.getAll();
                }).then(function (list2) {
                    list2.forEach(rasp => {
                        console.log(JSON.stringify(rasp, null, 2));
                        expect(rasp).to.have.property("state", "DOWN");
                    });
                    done();
                }).catch(function (error) {
                    done(JSON.stringify(error));
                });
        });
    });

    it("Emit to Raspberry", (done) => {
        this.emitToRaspberryTest = {
            gotMessage: false
        }
        const TEST_EVENT = "thisIsAnEvent";
        const TEST_EVENT_DATA = {a: "data1", b: "data2"};
        const oldMessager = process.messager;
        process.messager = (arg1, event, data) => {
            expect(arg1).to.be.undefined;   // eslint-disable-line
            expect(event).to.equal(TEST_EVENT);
            expect(data).to.deep.equal(TEST_EVENT_DATA);
            this.emitToRaspberryTest.gotMessage = true;
        };
        Raspberry.add("raspEventTest")
            .then(() => {
                return Raspberry.emitTo("raspEventTest", TEST_EVENT, TEST_EVENT_DATA)
            }).then(() => {
                console.log("then...");
                expect(this.emitToRaspberryTest.gotMessage).to.equals(true);
                process.messager = oldMessager; // eset messager;
                done();
            }).catch(done);
    });

    it("Module started", (done) => {
        this.moduleStartedTest = {
            gotEvent: false
        };
        const RASPBERRY_MODULE_CHANGED = "raspberry_module_will_change";
        const MODULE_CHANGED = "module_will_change";

        Raspberry.onModuleChange(MODULE_CHANGED, (raspberry, module, moduleInfo) => {
            console.log("EVENT");
            expect(raspberry).to.have.property("name", RASPBERRY_MODULE_CHANGED);
            expect(module).to.have.property("state", "UP");
            expect(module).to.have.property("name", MODULE_CHANGED);
            expect(moduleInfo).to.have.property("name", MODULE_CHANGED);
            this.moduleStartedTest.gotEvent = true;
        });

        Raspberry.add(RASPBERRY_MODULE_CHANGED, [MODULE_CHANGED])
            .then(() => {
                return Raspberry.start(RASPBERRY_MODULE_CHANGED);
            }).then(() => {
                return Raspberry.moduleStarted(RASPBERRY_MODULE_CHANGED, {name: MODULE_CHANGED});
            }).then(() => {
                expect(this.moduleStartedTest.gotEvent).to.equal(true);
                done();
            }).catch(err => done(err));
    });

    it("Module event listener: invalid callback should throw an error", () => {
        expect(Raspberry.onModuleChange.bind("never_mind", "this is not a function"))
            .to.throw(Error);
    });
});
