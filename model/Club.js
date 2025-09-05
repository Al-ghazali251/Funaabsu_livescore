const mongoose = require('mongoose');

const clubSchema = new mongoose.Schema({
clubName: {
    type: String,
  },
 
  clubCoach: {
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

    clubLogo: {
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
  phoneNumber: {
      type: String, // or Number, depending on your use case
    },
  
}, { strict: false }); // allows saving unspecified fields

const Club = mongoose.model('Club', clubSchema);

module.exports = Club;
