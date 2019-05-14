const passport = require('passport');
const LocalStrategy = require('passport-local');
const UniqueTokenStrategy = require('passport-unique-token');
const https = require('https');

const { Model } = require('../api/v1/users/model');

const verifyToken = token => new Promise((resolve, reject) => {
  https.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`, (resp) => {
    let data = '';
    resp.on('data', (chunk) => {
      data += chunk;
    });
    resp.on('end', () => {
      resolve(JSON.parse(data));
    });
  }).on('error', (err) => {
    reject(err);
  });
});

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
  },
  async (email, password, done) => {
    try {
      const user = await Model.findOne({ email });
      if (!user) return done(null, false);
      if (!user.verifyPassword(password)) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
));

passport.use(new UniqueTokenStrategy(
  async (token, done) => {
    try {
      const { email } = await verifyToken(token);
      const user = await Model.findOne({ email });
      if (!user) return done(null, false);
      if (!user.googleAuth) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  },
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  Model.findById(id, (err, user) => {
    done(err, user);
  });
});

module.exports.passport = passport;
module.exports.verifyToken = verifyToken;
