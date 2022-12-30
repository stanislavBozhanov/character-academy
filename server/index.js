require('dotenv').config();
const express = require('express');
const https = require('https');
// const session = require('express-session');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const randToken = require('rand-token');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { initializeDb } = require('./models/index.js');

const port = process.env.TOKEN_SERVER_PORT;
const SECRET = 'Shhhhhhhhhh...very big secret!';

const app = express();
// app.use(session({ secret: SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
// app.use(passport.session());
app.use(express.json()); // So we can pull req.body.<params>

const users = [];
const refreshTokens = {};

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  // If the token has expiration, raise unauthorized
  const expirationDate = new Date(jwtPayload.exp * 1000);
  if (expirationDate < new Date()) {
    return done(null, false);
  }
  const user = jwtPayload;
  done(null, user);
});

passport.use(jwtStrategy);

// passport.serializeUser((user, done) => {
//   done(null, user.username);
// });

// passport.deserializeUser((username, done) => {
//   done(null, username);
// });

app.get('/test_jwt', passport.authenticate('jwt'), (req, res) => {
  res.json({ success: 'You are authenticated with JWT!', user: req.user });
});

// Register a user
app.post('/createUser', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400);
  }

  const username = req.body.username;
  const password = req.body.password.toString();

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512');
  // const password = await bcrypt.hash(req.body.password, 10);

  users.push({ username, passwordHash, salt });
  res.status(201).send(users);

  console.log(users);
});

// Login and return token
app.post('/login', (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400);
  }

  const user = users.find((u) => u.username === req.body.username);
  if (!user) {
    res.status(404).send('User does not exits!');
  }
  const password = req.body.password.toString();
  const newHash = crypto.pbkdf2Sync(password, user.salt, 100000, 512, 'sha512');

  if (user.passwordHash.toString('hex') === newHash.toString('hex')) {
    const role = 'admin';
    const userObject = {
      username: req.body.username,
      role: role,
    };
    const accessToken = jwt.sign(userObject, SECRET, { expiresIn: 300 });
    const refreshToken = randToken.uid(256);
    refreshTokens[refreshToken] = req.body.username;
    res.json({ accessToken: `JTW${accessToken}`, refreshToken });
  } else {
    res.sendStatus(401);
  }
});

app.post('/token', (req, res) => {
  const username = req.body.name;
  const refreshToken = req.body.refreshToken;
  if (
    refreshToken in refreshTokens &&
    refreshTokens[refreshToken] === username
  ) {
    const userObject = {
      username,
      role: 'admin',
    };
    const token = jwt.sign(userObject, SECRET, { expiresIn: 300 });
    res.json({ token: `JWT${token}` });
  } else {
    res.sendStatus(401);
  }
});

// Not a bad idea to have a reject token endpoint if the refresh token gets stolen
// app.post('/token/reject', (req, res) => {
//   const refreshToken = req.body.refreshToken;
//   if (refreshToken in refreshTokens) {
//     delete refreshTokens[refreshToken];
//   }
//   res.send(204);
// });

// app.listen(port, () => {
//   console.log(`Auth server running on port: ${port}`);
// });

(async () => {
  await initializeDb();
  https.createServer({}, app).listen(4000);
})();
