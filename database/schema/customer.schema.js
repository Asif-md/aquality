
//schema for customer
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
exports.customerSchema = new Schema({
    username: { type: String, unique: true, dropDups: true },
    nid: { type: String },
    email: String,
    fullname: String,
    customer_currency: String,
    mobile_primary: String,
    mobile_secondary: String,
    website: String,
    country: String,
    location: String,
    area: String,
    city: String,
    description: String,
    postal_code: String,
    status: Boolean,
    isGenerateInvoiceMonthly: { type: Boolean, default: false },
    productList: [String],
    created_on: { type: Date, default: Date.now },
    normalized: String
});
