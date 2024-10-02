const mongoose = require('mongoose');

const passmasterSchema = new mongoose.Schema({
    
    finalshowid: {
        type: String,
        required: true
    },
    finalmerchanttxnid: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
        unique: false,
      },  
      finalquantity: {
        type: Number,
        required: true
      }, 
      finaltotalprice: {
        type: Number,
        required: true
      }, 
      finalcost: {
        type: Number,
        required: true
      }, 
      finalname: {
        type: String,
      }, 
      finalemail: {
        type: String,
      }, 
      finalphone: {
        type: String,
      }, 
      finaloccupation: {
        type: String,
      }, 
      finalpassid: {
        type: String,
        unique: true,
        
      }, 
   
});

const Passmaster = mongoose.model('Passmaster', passmasterSchema);

module.exports = Passmaster;