"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//schema for product
var mongoose = require("mongoose");
var Schema = mongoose.Schema;
exports.productSchema = new Schema({
    id: String,
    name: { type: String, unique: true, dropDups: true },
    rate: Number,
    quantity: Number,
    description: String,
    status: Boolean,
    vat: { type: Number, default: 0 },
    amount_with_vat: { type: Number, default: 0 },
});
