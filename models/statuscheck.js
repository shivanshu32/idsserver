const mongoose = require('mongoose');

const statuscheckSchema = new mongoose.Schema({
    
    entireresponse: {
        type: Object
    },

    createdOn: {
        type: Date,
        default: Date.now,
        unique: false,
      },  
     
   
});

const Statuscheck = mongoose.model('Stauscheck', statuscheckSchema);

module.exports = Statuscheck;