const mongoose = require('mongoose');

const designerSchema = new mongoose.Schema({
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
    location: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    social: {
        type: String,
        required: true
    },
    minspend: {
        type: String,
        required: true
    }
});

const Designer = mongoose.model('Designer', designerSchema);

module.exports = Designer;