
/*
* model for Area
*/
var mongoose = require("mongoose");
var area_schema_1 = require("../schema/area.schema");
exports.AreaModel = mongoose.model('area', area_schema_1.areaSchema);
