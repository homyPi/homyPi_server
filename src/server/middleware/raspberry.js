import Raspberry  from "../models/Raspberry";
var _ = require("lodash");

/**
 * Configure a new raspberry
 * @param {String} req.body.name instance name
 * @param {Array<String>} req.body.modules instance modules names
 * @param {Object} res response object
 */
var add = function(req, res) {
	if (!req.body || !req.body.name || !req.body.modules) {
		return res.json({status: "error", error: {code: -1, message: "invalid request"}});
	}
	Raspberry.add(req.body.name, req.body.modules)
		.then(function(raspberry) {
			return res.json({status: "success", data: raspberry});
		}).catch(function(error) {
			return res.json({status: "error", error: error});
		});
}

/**
 * Get all connected rasberries
 */
var getAll = function(req, res) {
	Raspberry.getAll()
		.then(function(list) {
			return res.json({status: "success", data: {
				items: list,
				total: list.length
			}});
		})
};

var get = function(req, res) {
	if (!req.params.name) return res.json({status: "error", error: {code: -1, message: "invalid request"}});
	Raspberry.findOne(req.params.name)
		.then(function(raspberry) {
			return res.json({status: "success", data: {
				raspberry: raspberry
			}});
		}).catch(res.json);
};

module.exports = {
	add: add,
	getAll: getAll,
	get: get
};