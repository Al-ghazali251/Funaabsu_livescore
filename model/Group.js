// model/Tournament.js
const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema(
  {
    groupName: {
      type: String,
      required: true,
    },
    club1: {
      type: String, // URL or path to image
      // required: true,
    },
     club2: {
      type: String, // URL or path to image
      // required: true,
    },
     club3: {
      type: String, // URL or path to image
      // required: true,
    },
     club4: {
      type: String, // URL or path to image
      // required: true,
    },
     tournamentName: {
      type: String, // URL or path to image
      // required: true,
    },
      date: {
      type: String, // URL or path to image
      // required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Group", groupSchema);
