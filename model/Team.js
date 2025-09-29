const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
teamName: {
    type: String,
  },
 
  teamCoach: {
    type: String
},

assitantCoach: {
  type: String
  },

  playerNames: [
    {
      name: {
        type: String, // not ObjectId
      },
    
      position: {
        type: String,
    
      }
    }
  ],
  teamLogo: {
      type: String
      },
  public_id: {
    type: String
    },
    gamesPlayed: {
        type: Number
        },

  matchDate: {
    type: Date, // Stores only the date part (e.g., 2025-08-26)
  },
  matchTime: {
    type: String, // Stores time in "HH:mm" or "HH:mm:ss" format
  },
  
  wins: {
      type: String, // or Number, depending on your use case
    },

   loss: {
      type: String, // or Number, depending on your use case
    },

     goalsScored: {
      type: String, // or Number, depending on your use case
    }, 
    goalsAgainst: {
      type: String, // or Number, depending on your use case
    },
  
}, { strict: false }); // allows saving unspecified fields

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;
