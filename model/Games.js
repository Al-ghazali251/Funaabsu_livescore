const mongoose = require('mongoose');

const gamesSchema = new mongoose.Schema({
homeTeam: {
    type: String,
  },
 
  awayTeam: {
    type: String
},

leagueName: {
  type: String
  },

  isTournament: {
    type: Boolean
    },

 
  googleId: {
  type: String
  },
  matchDate: {
    type: Date, // Stores only the date part (e.g., 2025-08-26)
   
  },
  matchTime: {
    type: String, // Stores time in "HH:mm" or "HH:mm:ss" format
  },
  phoneNumber: {
      type: String, // or Number, depending on your use case
    },
  
}, { strict: false }); // allows saving unspecified fields

const Games = mongoose.model('Games', gamesSchema);

module.exports = Games;
