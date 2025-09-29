// model/League.js
const mongoose = require("mongoose");

const LeagueSchema = new mongoose.Schema(
  {
    leagueName: {
      type: String,
      required: true,
    },
    leagueLogo: {
      type: String, // URL or path to image
      // required: true,
    },

  public_id: {
  type: String, // URL or path to image
  // required: true,
},

    teamStats: [
      {
        teamName: { type: String, required: true },
        teamLogo: { type: String },
        public_id: { type: String },
        wins: { type: Number, default: 0 },
        loss: { type: Number, default: 0 },
        goalsScored: { type: Number, default: 0 },
        goalsAgainst: { type: Number, default: 0 },
      },
    ],
  },
  { strict: false }
);

module.exports = mongoose.model("League", LeagueSchema);
