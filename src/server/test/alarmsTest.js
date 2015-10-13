global.__base = __dirname + "/../";
var should = require("should");
var schema = require('../models/mongoose/mongoose-schema.js')();
var connection = require('../models/mongoose/mongoose-connection');

var AlarmModels  = require(__base + "models/mongoose/mongoose-models").Alarm;

var Alarm  = require(__base + "models/Alarm");

var alarmData = require("./data/alarms");

describe('alarms', function() {

	before(function(done) {
		connection(done);
	});

	it("add", function(done) {
		var alarm = new Alarm(alarmData.alarm1.user,
			alarmData.alarm1.hours,
			alarmData.alarm1.minutes);
		alarm.save(function(err, data) {
			alarmData.alarm1._id = data._id;
			done(err);
		});
	});
	it("delete", function(done) {
		Alarm.model.remove({_id: alarmData.alarm1._id}, function(err) {
			done(err);
		});		
	});
});