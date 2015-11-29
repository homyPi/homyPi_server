var ServicesManager = require("../modules/ServicesManager")

var getAll = function(req, res) {
	ServicesManager.getServicesInfo(req.user).then(function(data) {
		res.json(data);
	}).catch(function(err) {
		console.log(err);
		res.json({err: err});
	});
};

module.exports = {
	getAll: getAll
};