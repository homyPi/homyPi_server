var mongoose = require("mongoose");
var Schema = mongoose.Schema;
module.exports = {
    require: [{module: "moduleSimple", version: "0.1"}],
    externals: [
        {
            baseSchema: "doesNotExist",
            name: "shouldNotBeCreated",
            schema: {
                id: String,
                name: String,
                other: Number
            }
        },
        {
            baseSchema: "simpleTestSchema",
            name: "shouldBeCreatedOne",
            schema: {
                id: String,
                name: String,
                other: Number
            }
        },
        {
            baseSchema: "simpleTestSchema",
            name: "shouldBeCreatedTwo",
            schema: {
                id: Number
            }
        },
        {
            baseSchema: "simpleTestSchema",
            name: "inDouble",
            schema: {
                id: Number
            }
        },
        {
            baseSchema: "simpleTestSchema",
            name: "inDouble",
            schema: {
                name: String
            }
        }
    ]
};
