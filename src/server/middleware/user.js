var userModel = require("../models/mongoose/mongoose-models").User;
var jwt = require("jwt-simple");
var fs = require("fs");
var bcrypt = require('bcrypt');
var config = require("../data/private/config.js");

var login = function(req, res) {
	if (!req.body.username || !req.body.password) {
		return res.json({error: "invalid request"});
	}
	userModel.findOne({username: req.body.username}, function(err, userInfo) {
		if (!userInfo) {
			return res.json({status: "error", data: "invalid"});
		} else {
			if (checkPassword(req.body.password, userInfo)) {
				return res.json({token: generateToken(
					{
						_id: userInfo._id,
						username: userInfo.username,
						isRaspberry: req.body.isRaspberry
					}
				)});
			} else {
				return res.json({status: "error", data: "invalid"});
			}
		}
		res.json({err: err, data:data});
	})
};

var encrypt = function(password, salt) {
	if (!salt) {
		salt = bcrypt.genSaltSync(12);
	}
	var hash = bcrypt.hashSync(password, salt);
	return hash


}

var checkPassword = function(requestPassword, userInfo) {
	return bcrypt.compareSync(requestPassword, userInfo.password);
};

var generateToken = function(userInfo) {
	return jwt.encode(userInfo, config.jwtSecret);
};

var isLoggedIn = function(req, res, next) {
	if (req.user) {
		return next();
	} else {
		return res.json({error: "unauthorized"});
	}
};

var getMe = function(req, res) {
	res.json({user: req.user});
};

var editPassword = function(req, res) {
	userModel.findOne({_id: req.user._id}, function(err, userInfo) {
		if (!userInfo) {
			return res.json({error: "invalid"});
		} else {
			if (!checkPassword(req.body.oldPassword, userInfo)) {
				return res.json({error: "invalid password"});
			}
			if (req.body.newPassword !== req.body.confirmNewPassword) {
				return res.json({error: "invalid new password"});
			} else {
				userInfo.password = encrypt(req.body.newPassword);
				userInfo.save(function(err) {
					if(err) {
						res.json({err: err});
					} else {
						res.json({status: "OK"});
					}
				});
			}
		}
	});
}
/*
var myArtists = function(req, res) {
	options = {
		offset: req.param("offset"),
		limit: req.param("limit")
	}
	if(req.param("convertTo") && (!req.param("limit") || req.param("limit") < 0)) {
		options.limit = 100;
	}
	Music.getMyArtists(req.user, options)
		.then(function(artists) {
			console.log(JSON.stringify(artists, null, 4))
			res.json({artists: artists});
		}).catch(function(err) {
			console.log(err);
			return res.json({err: err});
		});
}
*/
module.exports = {
	login: login,
	isLoggedIn: isLoggedIn,
	me: getMe,
	editPassword: editPassword
};
