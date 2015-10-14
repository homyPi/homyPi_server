var SpotifyAuth = require(__base + "modules/spotify/SpotifyAuth");
var Spotify = require(__base + "modules/spotify/Spotify");

var login = function(req, res) {
	var url = SpotifyAuth.connectUrl(req.user);
	console.log("redirect to " + url);
	res.redirect(url);
};
var getMe = function(req, res) {
	req.spotifyApi.getMe().then(function(me) {
		res.json({me: me});
	}).catch(function(err) {
		console.log(err);
		res.json({error: err})
	});
};
var getMyArtists = function(req, res) {
	console.log("getMyArtists");
	req.spotifyApi.getMyArtists(req.user).then(function(data) {
		res.json({data: data});
	}).catch(function(err) {
		res.json({err: err});
	});
};
var reloadMyArtists = function(req, res) {
	console.log("getMyArtists");
	req.spotifyApi.reloadMyArtists(function(err, data) {
		console.log(err);
		res.json({err: err, data: data});
	});
};
var oauth2callback = function(req, res) {
	req.query.state = JSON.parse(req.query.state);
	SpotifyAuth.getToken(req.query.state.uId, req.query.code, function (err, data) {
		res.json({err: err, data: data});
	});
};

var search = function(req, res) {
	console.log("search track");
	console.log(req.query);
	console.log("...");
	if (!req.query || !req.query.q) {
		return res.json({err: "missing search parameters"});
	}
	req.spotifyApi.search(req.query.q).then(function(response) {
		return res.json(response);
	}).catch(function(err) {
		console.log("search ended with an error");
		console.log(err);
		console.log(err.stack);
		return res.json({err: err});
	});
};

var getArtist = function(req, res) {
	req.spotifyApi.getArtistFull(req.params.id).then(function(artist) {
		res.json({artist: artist});
	}).catch(function(err) {
		console.log(err);
		console.log({err: err});
	})
}

var isSet = function(req, res, next) {
	SpotifyAuth.isSet(req.user).then(function(isSet) {
		if (isSet) {
			return next();
		} else {
			res.json({error: "not connected"});
		}
	}).catch(function(err) {
		return res.json({err: err});
	});
};

var getApi = function(req, res, next) {
	Spotify.getApi(req.user)
		.then(function(spotifyApi) {
			req.spotifyApi = spotifyApi;
			return next();
		}).catch(function(err) {
			return res.json({err: err});
		});
};

module.exports = {
	login: login,
	getMe: getMe,
	getMyArtists: getMyArtists,
	reloadMyArtists: reloadMyArtists,
	search:search,
	getArtist: getArtist,

	oauth2callback: oauth2callback,
	getApi: getApi
};