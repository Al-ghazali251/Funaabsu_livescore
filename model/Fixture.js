const mongoose = require('mongoose');

const fixtureSchema = new mongoose.Schema({
homeTeam: {
    type: String,
  },
 
  awayTeam: {
    type: String
},

leagueName: {
  type: String
  },

  homeComments: {
  type: [String]
  },

  awayComments: {
  type: [String]
  },

 // explicit structured stats for each side
  homeStats: {
    bigChance: { type: Number, default: 0 },
    gkSaves: { type: Number, default: 0 },
    fouls: { type: Number, default: 0 },
    freeKicks: { type: Number, default: 0 },
    yellowCard: { type: Number, default: 0 },
    redCard: { type: Number, default: 0 },
    penalty: { type: Number, default: 0 },
    offside: { type: Number, default: 0 },
    goalscorer: { type: [String], default: [] },
    assists: { type: [String], default: [] }
  },

  awayStats: {
    bigChance: { type: Number, default: 0 },
    gkSaves: { type: Number, default: 0 },
    fouls: { type: Number, default: 0 },
    freeKicks: { type: Number, default: 0 },
    yellowCard: { type: Number, default: 0 },
    redCard: { type: Number, default: 0 },
    penalty: { type: Number, default: 0 },
    offside: { type: Number, default: 0 },
    goalscorer: { type: [String], default: [] },
    assists: { type: [String], default: [] }
  },

  isLeague: {
    type: Boolean
    },

  tournamentName: {
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

const Fixture = mongoose.model('Fixture', fixtureSchema);

module.exports = Fixture;
