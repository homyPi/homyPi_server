/*global module*/
/*global require*/

var mongoose = require("mongoose"),
	bcrypt   = require('bcrypt-nodejs');
var ModuleManager = require("../../modules/ModuleManager");
module.exports = function () {
	"use strict";
	if (process.env.schemaLoaded) {
		return null;
	}
	var Schema = mongoose.Schema,
		schemaDescriptions = {
			GToken: {
				access_token: String,
				token_type: String,
				expiry_date: Number,
				refresh_token: String,
				user: Schema.Types.Mixed
			},
			SoundcloudToken: {
				access_token: String,
				scope: String,
				expires_in: Number,
				refresh_token: String,
				user: Schema.Types.Mixed
			},
			user: {
				username: String,
				password: String,
				tokens: {
					
				}
			},
			raspberry: {
				socketId: String,
				name: String,
				ip: String
			}
		};

	ModuleManager.executeSorted(function(module) {
		if(module.setSchemaDescriptions) {
			module.setSchemaDescriptions(schemaDescriptions);
		}
	});
	var userSchema = new Schema(schemaDescriptions.user);
	userSchema.methods.generateHash = function (password) {
		return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
	};

	// checking if password is valid
	userSchema.methods.validPassword = function (password) {
		return bcrypt.compareSync(password, this.password);
	};
	
	ModuleManager.executeSorted(function(module) {
		if(module.setSchemas) {
			module.setSchemas(schemaDescriptions);
		}
	});
	mongoose.model('GToken', new Schema(schemaDescriptions.GToken));
	mongoose.model('SoundcloudToken', new Schema(schemaDescriptions.SoundcloudToken));
	mongoose.model('User', userSchema);
	mongoose.model('Raspberry', new Schema(schemaDescriptions.raspberry));
	process.env.schemaLoaded = true;
	return Schema;
};
