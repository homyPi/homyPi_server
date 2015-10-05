var JSONResult = require(__base + 'models/JSONResult.js');

var MongooseError = function (err) {
    var message = JSONResult.error.UNKOWN;
    switch (err.name) {
        case "CastError":
            message = JSONResult.error.MONGOOSE_CAST_ERROR;
            break;
        default: message = JSONResult.error.UNKOWN;
    }
    message.original_error = err;
    this.result = new JSONResult(JSONResult.status.error, message);

}
module.exports = MongooseError;