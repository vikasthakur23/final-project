const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const jwt = require('jsonwebtoken');
const User = require('./models/User');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // find or create user
    const email = profile.emails && profile.emails[0] && profile.emails[0].value;
    let user = await User.findOne({ googleId: profile.id }) || await User.findOne({ email });
    if (!user) {
      user = await User.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        role: 'user'
      });
    } else {
      // update googleId if missing
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
    }

    // create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // attach token to user for redirect
    user.token = token;
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// required for passport session (no-op since we use token)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id).then(u => done(null, u)).catch(err => done(err));
});
