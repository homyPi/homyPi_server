/*global module*/
/*global require*/

var mongoose = require("mongoose"),
	bcrypt   = require('bcrypt-nodejs');
module.exports = function () {
	"use strict";
	if (process.env.schemaLoaded) {
		return null;
	}
	var Schema = mongoose.Schema,
		alarmSchema = new Schema({
			user: Schema.Types.Mixed,
			hours: { type: Number, min: 0, max: 23 },
			minutes: { type: Number, min: 0, max: 59 },
			enable: Boolean,
			repeat: Schema.Types.Mixed,
			history: [
				{
					execution_date: Date,
					executed_songs: [
						{
							source: String,
							name: String,
							artist: String,
							uri: String,
							similarTo: Schema.Types.Mixed,
							tempo: String
						}
					]
				}
			]
		}),
		GTokenShema = new Schema({
			access_token: String,
			token_type: String,
			expiry_date: Number,
			refresh_token: String,
			user: Schema.Types.Mixed
		}),
		SoundcloudTokenShema = new Schema({
			access_token: String,
			scope: String,
			expires_in: Number,
			refresh_token: String,
			user: Schema.Types.Mixed
		}),
		userSchema = new Schema({
			username: String,
			password: String,
			tokens: {
				spotify: {
					access_token: String,
					scope: String,
					expires_date: Number,
					refresh_token: String,
					request_id: Schema.ObjectId
				}
			}
		}),
		artistSchema = new Schema({
			userId: String,
			name: String,
			images: Schema.Types.Mixed,
			spotifyId: String,
			musicgraphId: String,
			useItAsAlarm: Boolean,
			user: {
				_id: Schema.ObjectId,
				username: String
			}
		}),
		raspberrySchema = new Schema({
			socketId: String,
			name: String,
			ip: String
		}),
		playlistSchema = new Schema ({
			idPlaying: String,
			tracks: [{
				_id: Schema.ObjectId,
				id: String,
				source: String,
				uri: String,
				name: String,
				duration_ms: Number,
				artists: [{
						id: String,
						name: String,
						uri:String
					}],
				album: {
					id: String,
					album_type: String,
					name: String,
					uri: String,
					images: { type : Array , "default" : [] }
				}
			}]
		});

	userSchema.methods.generateHash = function (password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};

	// checking if password is valid
	userSchema.methods.validPassword = function (password) {
		return bcrypt.compareSync(password, this.password);
	};
	mongoose.model('Alarm', alarmSchema);
	mongoose.model('GToken', GTokenShema);
	mongoose.model('SoundcloudToken', SoundcloudTokenShema);
	mongoose.model('User', userSchema);
	mongoose.model('Artist', artistSchema);
	mongoose.model('Playlist', playlistSchema);
	mongoose.model('Raspberry', raspberrySchema);
	process.env.schemaLoaded = true;
	return Schema;
};
