/* global describe */
/* global it */
import ServiceManager from "../modules/ServicesManager";
import {expect} from "chai";

const SERVICES = [
    {
        name: "test1", auth: {
            type: "oauth",
            login: function (req, res) {
                res.json({status: "ok"});
            },
            loginCallback: function (req, res) {
                res.json({status: "ok"});
            },
            isLoggedIn: function () {
                return new Promise(resolve => {
                    resolve({username: "geronimo"});
                });
            },
            getUser: function (user) {
                return new Promise(resolve => {
                    resolve({username: user.username, email: "oy@hey.com"});
                });
            }
        }
    },
    {
        name: "test2", auth: {
            type: "oauth",
            login: function () {},
            loginCallback: function () {},
            getUser: function () {
                return new Promise((resolve, reject) => {
                    reject({error: "something"});
                });
            }
        }
    },
    {
        name: "test3", auth: {
            type: "oauth",
            login: function () {},
            loginCallback: function () {}
        }
    }
];

describe("Services", function () {
    it("add services", () => {
        let initialLength = ServiceManager.getServices().length;
        ServiceManager.addServices(SERVICES);
        expect(ServiceManager.getServices().length).to.equal(initialLength + SERVICES.length);
    });
    it("invalid service should not be added", () => {
        let initialLength = ServiceManager.getServices().length;
        ServiceManager.addServices([
            null, {}, {name: "test"}, {auth: {}},
            {name: "aa", auth: {type: "banana"}}, {name: "aa", auth: {type: "oauth"}},
            {name: "aa", auth: {type: "oauth", login: function () {}}}
        ]);
        expect(ServiceManager.getServices().length).to.equal(initialLength);
    });
    it("Login test: should succeed", (done) => {
        let req = {params: {name: "test1"}};
        ServiceManager.login(req, {json: function (data) {
            expect(data).to.have.property("status", "ok");
            done();
        }});
    });
    it("Login test: unknown service => should fail", (done) => {
        let req = {params: {name: "unknownService"}};
        ServiceManager.login(req, {json: function (data) {
            expect(data).to.have.property("err", "unknown service");
            done();
        }});
    });

    it("Login callback test: should succeed", (done) => {
        let req = {params: {name: "test1"}};
        ServiceManager.loginCallback(req, {json: function (data) {
            expect(data).to.have.property("status", "ok");
            done();
        }});
    });
    it("Login callback test: unknown service => should fail", (done) => {
        let req = {params: {name: "unknownService"}};
        ServiceManager.loginCallback(req, {json: function (data) {
            expect(data).to.have.property("err", "unknown service");
            done();
        }});
    });

    it("get Services info", (done) => {
        let user = {username: "geronimo"};
        ServiceManager.getServicesInfo(user)
          .then(() => {
              done();
          }).catch(done);
    });
    it("get User: should succeed info", function (done) {
        let req = {params: {name: "test1"}, user: {username: "me"}};
        ServiceManager.getUser(req, {
            json: function (data) {
                expect(data).to.have.property("status", "success");
                expect(data).to.have.property("data");
                expect(data.data).to.have.property("user");
                expect(data.data.user).to.have.property("username", "me");
                expect(data.data.user).to.have.property("email");
                done();
            }
        });
    });
    it("get User: unknown service => should fail", function (done) {
        let req = {params: {name: "unknown"}, user: {username: "me"}};
        ServiceManager.getUser(req, {
            json: function (data) {
                expect(data).to.have.property("err", "404: Page not found");
                done();
            }
        });
    });
    it("get User: error should be handled", function (done) {
        let req = {params: {name: "test2"}, user: {username: "me"}};
        ServiceManager.getUser(req, {
            json: function (data) {
                expect(data).to.have.property("status", "error");
                done();
            }
        });
    });
    it("get User: no function getUser should be handled", function (done) {
        let req = {params: {name: "test3"}, user: {username: "me"}};
        ServiceManager.getUser(req, {
            json: function (data) {
                expect(data).to.have.property("err", "404: Page not found");
                done();
            }
        });
    });
});
