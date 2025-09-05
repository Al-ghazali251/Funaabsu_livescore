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
    medicalCondition: {
    type: String,
  },
    phoneNumber: {
    type: Number,
  },
  
  
}, { strict: false }); // allows saving unspecified fields

const Player = mongoose.model('Player', playerSchema);

module.exports = Player;
