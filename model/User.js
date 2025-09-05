const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
displayName: {
    type: String,
  },
  favoriteClub: {
    type: String,
  },
   profilePic: {
    type: String
   },
 
   email: {
    type: String
   },
  isAdmin: {
    type: Boolean
},

isCoach: {
  type: Boolean
},


college: {
  type: String,
},
 
  googleId: {
  type: String
  },

  phoneNumber: {
      type: String, // or Number, depending on your use case
    },
  
}, { strict: false }); // allows saving unspecified fields

const User = mongoose.model('User', userSchema);

module.exports = User;
