const mongoose = require('mongoose');

const uicallbackSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true
    },
    merchantId: {
        type: String,
        required: true
    },
    transactionId: {
        type: String,
        required: true,
        unique: true,
    },
    amount:{
        type: String,
        required: true
    },
    providerReferenceId: {
        type: String,
        required: true
    },
    merchantOrderId: {
        type: String,
    },
    entireresponse: {
        type: Object
    },

    createdOn: {
        type: Date,
        default: Date.now,
        unique: false,
      },  
     
   
});

const Uicallback = mongoose.model('Uicallback', uicallbackSchema);

module.exports = Uicallback;