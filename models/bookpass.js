const mongoose = require('mongoose');

const bookpassSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
       required: true
    },
    occupation: {
        type: String,
        required: true
    },
    showid: {
        type: String,
        required: true
    },
    merchanttxnid: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now,
        unique: false,
      },  
   
});

const Bookpass = mongoose.model('Bookpass', bookpassSchema);

module.exports = Bookpass;