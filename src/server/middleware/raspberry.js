var Raspberry  = require(__base + "models/Raspberry");
var _ = require("lodash");

var getAll = function(req, res) {
	var list = [];
	_.forEach(Raspberry.connectedClients, function(raspberry) {
		list.push(raspberry.get());
	});
	return res.json({raspberries: list});
};

module.exports = {
	getAll: getAll
};