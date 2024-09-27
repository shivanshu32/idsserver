const mongoose = require("mongoose");

const modelfSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: { type: String, unique: true },
  location: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  social: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    required: true,
  },
  experience: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
});

const Modelf = mongoose.model("Modelf", modelfSchema);

module.exports = Modelf;
