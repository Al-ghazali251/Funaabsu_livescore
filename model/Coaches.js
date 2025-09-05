const mongoose = require('mongoose');

const coachSchema = new mongoose.Schema({
email: {
    type: String,
  },
  
}, { strict: false }); // allows saving unspecified fields

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Coach;
