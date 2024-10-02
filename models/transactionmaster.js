const mongoose = require('mongoose');

const transactionmasterSchema = new mongoose.Schema({
    
    showid: {
        type: String,
        required: true
    },
    merchanttxnid: {
        type: String,
        required: true,
        unique: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
        unique: false,
      },  
      quantity: {
        type: Number,
        required: true
      }, 
      totalprice: {
        type: Number,
        required: true
      }, 
      cost: {
        type: Number,
        required: true
      }, 
      paymentstatus: {
        type: String,
        default: "start"
      }, 
   
});

const Transactionmaster = mongoose.model('Transactionmaster', transactionmasterSchema);

module.exports = Transactionmaster;