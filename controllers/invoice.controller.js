
var _ = require("underscore");
var customer_model_1 = require("../database/models/customer.model");
var invoice_model_1 = require("../database/models/invoice.model");
var product_model_1 = require("../database/models/product.model");
var path = require("path");
var fs = require("fs");
var InvoiceController = /** @class */ (function () {
    function InvoiceController() {
    }
    InvoiceController.removeInvoice = function (res, data) {
        res.send(data);
    };
    InvoiceController.createNewInvoice = function (res, data) {
        var invoice = new invoice_model_1.AllInvoiceModel({
            customer_id: data.customer_id,
            payment_due_date: data.date,
            amount_due: data.total,
            status: data.status,
            total: data.total,
            discount: data.discount,
            invoice_created_date: data.date,
            productList: data.productList,
            created_on: data.date,
            type: "all"
        });
        invoice.save(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    InvoiceController.getInvoiceByCustomerId = function (res, id) {
        var res_data = [];
        invoice_model_1.AllInvoiceModel.find({ customer_id: id }, function (err, data) {
            if (!err) {
                var res_data_1 = data;
                invoice_model_1.RecentInvoiceModel.findOne({ customer_id: id }, function (err, data) {
                    if (!err) {
                        res_data_1.push(data);
                        res.send(res_data_1);
                    }
                    else {
                        res.send({ status: false });
                    }
                });
            }
            else {
                res.send({ status: false });
            }
        });
    };
    InvoiceController.globalSearchByCustomer = function (res, text) {
        //get customer name from ids
        var query = customer_model_1.CustomerModel.find({
            $or: [
                {
                    "username": {
                        $regex: ".*" + text + ".*",
                        $options: "i"
                    }
                },
                {
                    "fullname": {
                        $regex: ".*" + text + ".*",
                        $options: "i"
                    }
                }
            ]
        }, ["username", "fullname"]);
        query.exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    InvoiceController.saveAutoInvoice = function (res, req) {
        var base64Data = req.body.pdf;
        var imageBuffer = InvoiceController.decodeBase64Image(base64Data);
        var filename = req.body.label + '.pdf';
        //get current month name and make dir
        var d = new Date();
        var month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";
        var dirname = month[d.getMonth()];
        var dir_path = path.join(__dirname, "../../../", dirname);
        if (!fs.existsSync(dir_path)) {
            fs.mkdirSync(dir_path);
        }
        var saveTo = path.join(__dirname, "../../../", dirname, filename);
        fs.writeFile(saveTo, imageBuffer["data"], function (err) {
            if (!err) {
                res.send({ status: true });
            }
            else {
                res.send({ status: false });
            }
        });
    };
    InvoiceController.decodeBase64Image = function (dataString) {
        var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/), response = {};
        if (matches.length !== 3) {
            return new Error('Invalid input string');
        }
        response['type'] = matches[1];
        response['data'] = new Buffer(matches[2], 'base64');
        return response;
    };
    InvoiceController.getAllInvoiceCount = function (res) {
        invoice_model_1.AllInvoiceModel.count(function (err, c) {
            if (!err) {
                res.send({ count: c });
            }
            else {
                res.send({ count: 0 });
            }
        });
    };
    InvoiceController.getRecentInvoiceCustomers = function (res) {
        customer_model_1.CustomerModel.find({
            $and: [
                { status: true },
                {
                    productList: {
                        $exists: true, $not: { $size: 0 }
                    }
                }
            ]
        }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    InvoiceController.storeInvoice = function (res, data) {
        var invoice = new invoice_model_1.AllInvoiceModel({
            customer_id: data.customer_id,
            payment_due_date: data.payment_due_date,
            amount_due: data.amount_due,
            status: data.status,
            total: data.total,
            discount: data.discount,
            invoice_created_date: data.invoice_created_date,
            paid_date: data.paid_date,
            amount_partially_paid: data.amount_partially_paid,
            productList: data.productList,
            type: "all"
        });
        invoice.save(function (err, data) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true, id: data._id });
            }
        });
    };
    InvoiceController.generateInvoice = function (res, data) {
        res.send(data);
    };
    InvoiceController.getInvoiceById = function (res, type, id) {
        if (type == 'recent') {
            invoice_model_1.RecentInvoiceModel.findById(id, function (err, data) {
                res.send(data);
            });
        }
        else if (type == 'all') {
            invoice_model_1.AllInvoiceModel.findById(id, function (err, data) {
                res.send(data);
            });
        }
        else {
            res.send({ status: false });
        }
    };
    InvoiceController.searchByUsername = function (res, data) {
        invoice_model_1.AllInvoiceModel.find({ "username": { $regex: ".*" + data.text + ".*", $options: 'i' } }, function (err, data) {
            if (!err) {
                res.send(data);
            }
        });
    };
    InvoiceController.saveRecentInvoice = function (res, data) {
        var invoice = new invoice_model_1.RecentInvoiceModel({
            customer_id: data.customer_id,
            payment_due_date: data.payment_due_date,
            amount_due: data.amount_due,
            status: data.status,
            total: data.total,
            discount: data.discount,
            paid_date: data.paid_date,
            amount_partially_paid: data.amount_partially_paid,
            productList: data.productList,
            type: "recent"
        });
        invoice.save(function (err, data) {
            if (err) {
                res.send({ status: false });
            }
            else {
                res.send({ status: true, id: data._id });
            }
        });
    };
    InvoiceController.dropRecentInvoiceAll = function (res) {
        if (invoice_model_1.RecentInvoiceModel.collection.drop()) {
            res.send({ status: true });
        }
        else {
            res.send({ status: false });
        }
    };
    InvoiceController.checkRecentInvoiceExists = function (res) {
        invoice_model_1.RecentInvoiceModel.count({}, function (err, count) {
            res.send({ "count": count });
        });
    };
    InvoiceController.getRecentInvoiceDB = function (res, paginationCount) {
        var skip_count = (paginationCount - 1) * 30;
        invoice_model_1.RecentInvoiceModel.find({}).skip(skip_count).limit(30).exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    InvoiceController.cleanInvoice = function (res) {
        var isClean = false;
        var date = new Date();
        var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        invoice_model_1.RecentInvoiceModel.find({
            "created_on": {
                $lt: firstDay
            }
        }, function (err, data) {
            if (data.length <= 0) {
                res.send({ "status": false });
            }
            _.each(data, function (obj) {
                // clean from recent and push to all
                isClean = true;
                var invoice = new invoice_model_1.AllInvoiceModel({
                    recent_id: obj['_id'],
                    customer_id: obj['customer_id'],
                    payment_due_date: obj['payment_due_date'],
                    amount_due: obj['amount_due'],
                    status: obj['status'],
                    total: obj['total'],
                    discount: obj['discount'],
                    invoice_created_date: obj['invoice_created_date'],
                    paid_date: obj['paid_date'],
                    amount_partially_paid: obj['amount_partially_paid'],
                    productList: obj['productList'],
                    created_on: obj['created_on']
                });
                invoice.save(function (err, newData) {
                    if (!err) {
                        invoice_model_1.RecentInvoiceModel.findOne({ '_id': newData['recent_id'] }).remove(function (err) {
                            if (!err) {
                                isClean = true;
                                customer_model_1.CustomerModel.findOne({
                                    $and: [
                                        {
                                            '_id': newData['customer_id']
                                        },
                                        {
                                            'status': true
                                        }
                                    ]
                                }, function (err, customer) {
                                    if (customer) {
                                        var date_1 = new Date();
                                        var firstDay_1 = new Date(date_1.getFullYear(), date_1.getMonth(), 1);
                                        var newInvoice_1 = new invoice_model_1.RecentInvoiceModel({
                                            customer_id: customer['_id'],
                                            payment_due_date: firstDay_1,
                                            amount_due: 0,
                                            status: 'Due',
                                            total: 0,
                                            discount: 0,
                                            amount_partially_paid: [],
                                            productList: customer['productList']
                                        });
                                        product_model_1.ProductModel.find({ "_id": { "$in": customer['productList'] } }, function (err, docs) {
                                            _.each(docs, function (item) {
                                                newInvoice_1['total'] += item['rate'];
                                            });
                                            newInvoice_1['amount_due'] = newInvoice_1['total'];
                                            newInvoice_1.save(function () {
                                                // console.log(data);
                                            });
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else {
                        res.send({ status: 'error in invoice save' });
                    }
                });
            });
        }, function () {
            res.send({ "status": isClean });
        });
    };
    InvoiceController.changeStatus = function (res, data) {
        if (data['type'] == 'recent') {
            invoice_model_1.RecentInvoiceModel.update({ _id: data['_id'] }, {
                $set: {
                    customer_id: data['customer_id'],
                    payment_due_date: data['payment_due_date'],
                    amount_due: data['amount_due'],
                    status: data['status'],
                    total: data['total'],
                    discount: data['discount'],
                    invoice_created_date: data['invoice_created_date'],
                    paid_date: data['paid_date'],
                    amount_partially_paid: data['amount_partially_paid'],
                    productList: data['productList']
                }
            }, function (err) {
                if (err) {
                    res.send({ status: false });
                }
                else {
                    res.send({ status: true });
                }
            });
        }
        else {
            invoice_model_1.AllInvoiceModel.update({ _id: data['_id'] }, {
                $set: {
                    customer_id: data['customer_id'],
                    payment_due_date: data['payment_due_date'],
                    amount_due: data['amount_due'],
                    status: data['status'],
                    total: data['total'],
                    discount: data['discount'],
                    invoice_created_date: data['invoice_created_date'],
                    paid_date: data['paid_date'],
                    amount_partially_paid: data['amount_partially_paid'],
                    productList: data['productList'],
                    type: "all"
                }
            }, function (err) {
                if (err) {
                    res.send({ status: false });
                }
                else {
                    res.send({ status: true });
                }
            });
        }
    };
    InvoiceController.buildAndSaveRecentInvoice = function (res) {
        customer_model_1.CustomerModel.find({
            $and: [
                {
                    productList: {
                        $exists: true, $not: { $size: 0 }
                    }
                },
                {
                    status: true
                }
            ]
        }, function (err, data) {
            var date = new Date();
            var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
            _.each(data, function (customer) {
                var invoice = new invoice_model_1.RecentInvoiceModel({
                    customer_id: customer['_id'],
                    payment_due_date: firstDay,
                    amount_due: 0,
                    status: 'Due',
                    total: 0,
                    discount: 0,
                    amount_partially_paid: [],
                    productList: customer['productList'],
                    type: 'recent'
                });
                product_model_1.ProductModel.find({ "_id": { "$in": customer['productList'] } }, function (err, docs) {
                    _.each(docs, function (item) {
                        invoice['total'] += item['rate'];
                    });
                    invoice['amount_due'] = invoice['total'];
                    invoice.save(function () {
                        // console.log(data);
                    });
                });
            });
            res.send({ status: true });
        });
    };
    InvoiceController.savePartialPay = function (res, data) {
        var pay_data = {
            date: Date.now(),
            amount: data['amount_partially_paid']
        };
        invoice_model_1.RecentInvoiceModel.findByIdAndUpdate(data['id'], { $push: { "amount_partially_paid": { date: pay_data['date'], amount: pay_data['amount'] } } }, { safe: true, upsert: true, new: true }, function (err, docs) {
            var total_partial_pay = 0;
            _.each(docs['amount_partially_paid'], function (item) {
                total_partial_pay += item['amount'];
            });
            if (total_partial_pay >= docs['total']) {
                invoice_model_1.RecentInvoiceModel.update({ _id: data['id'] }, {
                    $set: {
                        status: 'Paid',
                        amount_due: 0,
                        paid_date: Date.now()
                    }
                }, function (err) {
                    if (err) {
                        res.send({ status: false });
                    }
                    else {
                        res.send({ status: true });
                    }
                });
            }
            else {
                invoice_model_1.RecentInvoiceModel.update({ _id: data['id'] }, {
                    $set: {
                        status: 'Partially Paid',
                        amount_due: docs['total'] - total_partial_pay
                    }
                }, function (err) {
                    if (err) {
                        res.send({ status: false });
                    }
                    else {
                        res.send({ status: true });
                    }
                });
            }
        });
    };
    InvoiceController.preGenerateUpdate = function (res, data) {
        if (data['type'] == 'recent') {
            invoice_model_1.RecentInvoiceModel.update({ _id: data.id }, {
                $set: {
                    amount_due: data.amount_due,
                    discount: data.discount,
                    productList: data.productList,
                    total: data.total,
                    amount_partially_paid: data.amount_partially_paid
                }
            }, function (err) {
                if (err) {
                    res.send({ status: false });
                }
                else {
                    res.send({ status: true });
                }
            });
        }
        else if (data['type'] == 'all') {
            invoice_model_1.AllInvoiceModel.update({ _id: data.id }, {
                $set: {
                    amount_due: data.amount_due,
                    discount: data.discount,
                    productList: data.productList,
                    total: data.total,
                    amount_partially_paid: data.amount_partially_paid,
                }
            }, function (err) {
                if (err) {
                    res.send({ status: false });
                }
                else {
                    res.send({ status: true });
                }
            });
        }
        else {
            res.send({ status: false });
        }
    };
    InvoiceController.deleteInvoice = function (res, data) {
        if (data['type'] === 'recent') {
            invoice_model_1.RecentInvoiceModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
        else {
            invoice_model_1.AllInvoiceModel.find({ _id: data['_id'] }).remove(function (err) {
                if (!err) {
                    res.send({ status: true });
                }
                else {
                    res.send({ status: false });
                }
            });
        }
    };
    InvoiceController.getAllInvoices = function (res, paginationCount) {
        var skip_count = (paginationCount - 1) * 30;
        invoice_model_1.AllInvoiceModel.find({}).skip(skip_count).limit(30).exec(function (err, data) {
            if (!err) {
                res.send(data);
            }
            else {
                res.send({ status: false });
            }
        });
    };
    return InvoiceController;
}());
exports.InvoiceController = InvoiceController;
