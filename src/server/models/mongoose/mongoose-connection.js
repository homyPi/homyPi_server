/*global console*/
/*global module*/
var config = require(__base + "data/private/config.js");
var mongoose = require('mongoose');
var models = require('./mongoose-models.js');
module.exports = function (callback) {
    "use strict";
    console.log("connecting to " + config.server_config.MONGO_URI);
    mongoose.connect(config.server_config.MONGO_URI, function (err) {
        if (err) {
            console.log('error occurred, when attempted to connect db. Error: ' + err);
        }
    });
    var db = mongoose.connection;

    db.on('error', function(err) {
        if(callback) {
            callback(err);
        }
    });
    db.once('open', function () {
        console.log("connected");
        if(callback) {
            callback();
        }
    });
    return db;

};