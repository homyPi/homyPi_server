/*global module*/
/*global require*/
var mongoose = require("mongoose")
module.exports = {
	Alarm : mongoose.model('Alarm'),
	GToken : mongoose.model('GToken'),
	SoundcloudToken : mongoose.model('SoundcloudToken'),
	User : mongoose.model('User'),
	Artist : mongoose.model('Artist'),
	Playlist : mongoose.model('Playlist'),
	Raspberry : mongoose.model('Raspberry')
};