const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
       unique: true
    },
    brandlink: {
        type: String,
        required: true
    },
    brandname: {
        type: String,
        required: true
    },
    designation: {
        type: String,
        required: true
    }
});

const Brand = mongoose.model('Brand', brandSchema);

module.exports = Brand;