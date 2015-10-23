var AuthManager = require(__base + "modules/AuthManager")

var getAll = function(req, res) {
	var services = AuthManager.getServices();
	res.json({})
};

module.exports = {
	getAll: getAll
};