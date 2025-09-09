const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cloudinary = require('cloudinary').v2;
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const rateLimit = require("express-rate-limit");
const crypto = require("crypto"); 
const User = require('./model/User');
const Coaches = require('./model/Coaches');
const Club = require('./model/Club');
const Player = require('./model/Player');

dotenv.config();
const mongo_uri = process.env.MONGO_URI;
mongoose.connect(mongo_uri);


const cors = require("cors");


const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});

db.once('open', () => {
    console.log("Database Connection Established Succesfully");
});


const app = express();




app.use(cors({
    origin:  true ,//['https://nuesa-funaab.vercel.app', 'http://localhost:3000'], // not `true` anymore // Allow all origins dynamically
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());




// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  
  // Configure transporter (use environment variables for security)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });


  app.set('trust proxy', 1);



  // Initialize Passport
  app.use(passport.initialize());


  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100                  // limit each IP to 100 requests
  });
  app.use(limiter);  


// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://funaabsul-ivescore.onrender.com/auth/google_callback"
}, async (accessToken, refreshToken, profile, done) => {
    // console.log("Google Profile Data:", profile); 
    // Check if user exists in DB

    let user = await User.findOne({ googleId: profile.id });
    if (!user) {
        user = new User({
            googleId: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            profilePic: profile.photos[0].value,
            isCoach: false,
            isAdmin: false,
            
         
        });
        await user.save();
    }
    else{

    }
   

    return done(null, user);
}));


const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.query.token;
  
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : authHeader;
  
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
  };


    // Google Auth Route
app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);




app.get(
    "/auth/google_callback",
    passport.authenticate("google", { failureRedirect: "/", session: false }),
    (req, res) => {
      const token = jwt.sign(
        { userId: req.user.googleId },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );
  
  
      res.send(`
        <html>
          <head></head>
          <body>
            <script>
              window.opener.postMessage(
                { token: "${token}" },
                "https://dev-funaabsu-livescore.vercel.app"
              );
              window.close();
            </script>
          </body>
        </html>
      `);
    }
  );
  


  
  

// Dashboard (Protected)
app.get('/dashboard', authenticateJWT, async (req, res) => {

  try{
 
    const userId = req.user.userId;

    console.log('User from JWT:', req.user);

  let user = await User.findOne({ googleId:userId});

  if (!user.phoneNumber) {
    console.log("User has not registred at all");
  
      return res.json({ onboarded: false }); 
  }
  else if ( user.phoneNumber){
    console.log("user has Onboarded");
      return res.json({ onboarded: true });
  }

}
catch (error) {
  console.error("Error in /dashboard", error);
  res.status(500).json({ message: "Internal server error" });
}
});

app.get('/user-details', authenticateJWT, async (req, res) => {
  try {

    const userId = req.user.userId;


    if (!userId) {
      return res.status(400).json({ message: "Missing googleId in session" });
    }

    const user = await User.findOne({ googleId: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error in /user-detail:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// POST /coach-access
app.post("/coach-access", authenticateJWT, async (req, res) => {
  try {
    const userId = req.user.id; // from middleware
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isAdmin) {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const newAccess = new CoachAccess({ email });
    await newAccess.save();

    res.status(201).json({ message: "Coach access granted", email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});


app.post('/update-profile', authenticateJWT, async (req, res) => {
  try {
  
    const userId = req.user.userId;

      if (!userId) {
          return res.status(400).json({ message: "Missing userId in request" });
      }

                  // const { fullName, level, matricNumber, phoneNumber, department } = req.body;
          const displayName = req.body.displayName;
          const phoneNumber = req.body.phoneNumber;
          const college = req.body.college;
          const department = req.body.department;
          const favoriteClub = req.body.favoriteClub;
     
          console.log(req.body);


      const user = await User.findOne({ googleId: userId });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      // Update user fields
      user.college = college;
      user.department = department;
      user.department = department;
      user.displayName = displayName;
      user.phoneNumber = phoneNumber;
      user.favoriteClub = favoriteClub;
 

      await user.save();

      res.status(200).json({ message: "User profile updated successfully", user });

  } catch (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ message: "Internal server error" });
  }
});


// POST /create-club
app.post("/create-club", async (req, res) => {
  try {
    //  const userId = req.user.userId; // from middleware
    //    if (!userId) {
    //       return res.status(400).json({ message: "Missing userId in request" });
    //   }
    //  const user = await User.findOne({ googleId: userId });

    // if (!user) {
    //   return res.status(404).json({ message: "User not found" });
    // }

    // if (!user.isAdmin) {
    //   return res.status(403).json({ message: "Access denied. Admins only." });
    // }

    console.log(req.body);
      const club = new Club(req.body); // accepts all fields, extra ones too due to strict: false
      await club.save();
  

    res.status(201).json({ message: "Club access granted", club });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

  // Add new Player
app.post('/add-player', async (req, res) => {
  try {
    // const { name, postHeld, image, whatsappLink, phoneNumber, xLink } = req.body.payLoad;

    const player = new Player(req.body); // accepts all fields, extra ones too due to strict: false
    player.goalsScored = 0;
    player.goalsAssisted = 0;
    await player.save();

  

  

    res.status(201).json({
      message: 'Player added successfully',
      player: player
    });
  } catch (error) {
    console.error('Error adding Exco:', error);
    res.status(500).json({ message: 'Failed to add Player' });
  }
});


// Get all clubs
app.get('/clubs', async (req, res) => {
    try {
      const clubs = await Club.find(); // most recent first
      res.json({ clubs });
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch clubs' });
    }
  });

// Get all player
app.get('/players', async (req, res) => {
    try {
      const players = await Player.find(); // most recent first
      res.json({ players });
    } catch (error) {
      console.error('Fetch error:', error);
      res.status(500).json({ error: 'Failed to fetch players' });
    }
  });



  // POST multiple players at once
app.post("/players/bulk", async (req, res) => {
  try {
    const players = req.body; // expecting an array of player objects
    if (!Array.isArray(players)) {
      return res.status(400).json({ message: "Request body must be an array" });
    }

    const savedPlayers = await Player.insertMany(players);
    res.status(201).json({
      message: "Players saved successfully",
      count: savedPlayers.length,
      data: savedPlayers,
    });
  } catch (error) {
    res.status(500).json({ message: "Error saving players", error });
  }
});

  app.listen(3000, '0.0.0.0', () => {
    console.log("Server is running on port 3000");
  });