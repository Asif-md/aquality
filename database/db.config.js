
var mongoose_1 = require("mongoose");
/*
*   Database connection to mongoDB
*/
exports.connectMongoDB = function () {
    secret: 'yoursecret'
    mongoose_1.connect('mongodb://localhost/invoiceDB', function (err) {
        if (err) {
            console.log("Failed to connect to DB");
        }
        else {
            console.log("Successfully connected to MongoDB");
        }
    });
};



//mongodb://mohammedasif:asif123@ds129936.mlab.com:29936/sofkuldb
//mongodb://localhost/invoiceDB 
