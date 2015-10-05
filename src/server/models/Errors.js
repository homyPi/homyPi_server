/**
 * Created by nolitsou on 9/6/15.
 */
var errors = require(__base + "data/public/errors.json");
var Error = function(error, message) {
	this.status = error || 500;
	this.message = message || "Unknown error";
};

module.exports = {
	Error: Error
};