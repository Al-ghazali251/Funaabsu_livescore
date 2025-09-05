const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
playerName: {
    type: String,
  },
  goalsScored: {
    type: Number,
  },
  goalsAssisted: {
    type: Number,
  },
  position: {
    type: String,
  },
  playerClub: {
    type: String,
  },
  
}, { strict: false }); // allows saving unspecified fields

const Coach = mongoose.model('Coach', coachSchema);

module.exports = Coach;
