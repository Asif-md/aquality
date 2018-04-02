var mongoose = require("mongoose");
var Schema = mongoose.Schema;
exports.areaSchema = new Schema({
    id: String,
    name: { type: String, unique: true, dropDups: true },
    status: { type: Boolean, default: true }
});


