/*global console*/
/*global module*/
var config = require(__base + "data/private/config.json");
var mongoose = require('mongoose');
var models = require('./mongoose-models.js');
module.exports = function () {
    "use strict";
    console.log("connecting to " + config.server_config.MONGO_URI);
    mongoose.connect(config.server_config.MONGO_URI, function (err) {
        if (err) {
            console.log('error occurred, when attempted to connect db. Error: ' + err);
        }
    });
    var db = mongoose.connection;

    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function callback() {
        console.log("connected");
    });
    return db;

};