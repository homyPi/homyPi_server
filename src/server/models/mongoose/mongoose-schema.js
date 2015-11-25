/*global module*/
/*global require*/

var mongoose = require("mongoose"),
	_   = require('lodash'),
	bcrypt   = require('bcrypt-nodejs');
var ModuleManager = require("../../modules/ModuleManager");

var MongooseModels = require("./mongoose-models");

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
			User: {
				username: String,
				password: String,
				externals: {
				}
			},
			Raspberry: {
				socketId: String,
				name: String,
				ip: String,
				state: { type: String, enum: ["UP", "STARTING", "DOWN"] },
				modules: [{
					name: String,
					state: { type: String, enum: ["UP", "STARTING", "DOWN"] } 
				}]
			}
		};

	ModuleManager.executeSorted(function(module) {
		if (module.schemas) {
			_.forEach(module.schemas, function(schema, name) {
				if (schemaDescriptions[name]) {
					console.log(name + " already defined");
				} else {
					schemaDescriptions[name] = schema;
				}
			});
		}
		if(module.externals) {
			for(var i = 0; i < module.externals.length; i++) {
				var ext = module.externals[i];
				if (schemaDescriptions[ext.baseSchema] && schemaDescriptions[ext.baseSchema].externals) {
					schemaDescriptions[ext.baseSchema].externals[ext.name] = ext.schema;
				} else {
					console.log("unknown schema " + ext.baseSchema + " or no externals");
				}
			}
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
	_.forEach(schemaDescriptions, function(schema, name) {
		console.log("set " + name);
		mongoose.model(name, new Schema(schema));
		MongooseModels[name] = mongoose.model(name);
	});
	process.env.schemaLoaded = true;
	return Schema;
};
