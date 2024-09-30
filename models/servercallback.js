const mongoose = require('mongoose');

const servercallbackSchema = new mongoose.Schema({
    
    entireresponse: {
        type: Object
    },

    createdOn: {
        type: Date,
        default: Date.now,
        unique: false,
      },  
     
   
});

const Servercallback = mongoose.model('Servercallback', servercallbackSchema);

module.exports = Servercallback;