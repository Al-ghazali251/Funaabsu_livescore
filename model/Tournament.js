// model/Tournament.js
const mongoose = require("mongoose");

const TournamentSchema = new mongoose.Schema(
  {
    tournamentName: {
      type: String,
      required: true,
    },
    tournamentLogo: {
      type: String, // URL or path to image
      // required: true,
    },
  },
  { strict: false }
);

module.exports = mongoose.model("Tournament", TournamentSchema);
