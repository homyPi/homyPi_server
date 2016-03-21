import Promise from "bluebird";
var mongoose = require("mongoose");
// var mongoose = new Mongoose();

var mockgoose = require("mockgoose");
mockgoose(mongoose);

function initDB() {
    return new Promise((resolve) => {
        resolve(mongoose);
    });
}

export default function initMongoMock() {
    return new Promise((resolve, reject) => {
        process.env.schemaLoaded = false;   // eslint-disable-line
        mongoose.connect("mongodb://example.com/TestingDB", function (err) {
            if (err) return reject(err);
            return initDB().then(resolve).catch(reject);
        });
    });
}
