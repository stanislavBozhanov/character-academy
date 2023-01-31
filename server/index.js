// require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
// const session = require('express-session');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const { initializeDb, User } = require('./models/index.js');

// const port = process.env.TOKEN_SERVER_PORT;
const SECRET = 'Shhhhhhhhhh...very big secret!';
const REFRESH_SECRET = 'Shhhhhhhhhhhhh....another very big secret!';
const DEFAULT_ROLE = 'user';

const app = express();
app.use(cors()); // cors is enabled for all requests and all origins
// app.use(session({ secret: SECRET, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
// app.use(passport.session());  // TODO check if passport requires this
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

// TODO check if passport requires this
// passport.serializeUser((user, done) => {
//   done(null, user.username);
// });

app.get('/test_jwt', passport.authenticate('jwt'), (req, res) => {
  res.json({ success: 'You are authenticated with JWT!', user: req.user });
});

// Register a user
app.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.status(400).json({ message: 'Missing email, password or username!' });
    res.send();
    return;
  }

  const username = req.body.username.toString();
  const password = req.body.password.toString();
  const email = req.body.email.toString();

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512');

  // TODO check if username already exists and throw an error response
  // TODO handle creating users with the same name or the same email

  const resultEmail = await User.findAll({
    where: {
      email: req.body.email,
    },
  });
  if (resultEmail.length) {
    res.status(400).json({ message: 'User with that email already exists!' });
    res.send();
    return;
  }

  const resultUsername = await User.findAll({
    where: {
      username: req.body.username,
    },
  });
  if (resultUsername.length) {
    res.status(400).json({ message: 'User with that username already exists!' });
    res.send();
    return;
  }

  await User.create({
    username: username,
    email: email,
    passwordHash: passwordHash,
    salt: salt,
    role: DEFAULT_ROLE,
  });

  res.status(201).send('User successfully created!');
});

// Login and return token
app.post('/login', async (req, res) => {
  console.log('here');
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ message: 'Missing email or password!' });
    res.send();
    return;
  }

  // TODO Make a safe switch to allow only 10 password attempts every 1 hour or something
  const result = await User.findAll({
    where: {
      email: req.body.email,
    },
  });
  const userModel = result[0];
  if (!userModel) {
    res.status(404).json({ message: 'User does not exits!' });
    res.send();
    return;
  }

  const userData = userModel.dataValues;
  const password = req.body.password.toString();
  const newHash = crypto.pbkdf2Sync(password, userData.salt, 100000, 512, 'sha512');

  if (crypto.timingSafeEqual(userData.passwordHash, newHash)) {
    // default role will be user. Admins will be manually created for now
    const userObject = {
      username: userModel.username,
      email: userModel.email,
      role: DEFAULT_ROLE,
    };
    const accessToken = jwt.sign(userObject, SECRET, { expiresIn: '3h' });
    const refreshToken = jwt.sign(userObject, REFRESH_SECRET, { expiresIn: '7d' });
    await userModel.update({
      refreshToken: refreshToken,
    });
    res.status(200).json({ accessToken: `JTW${accessToken}`, refreshToken });
  } else {
    res.status(401).json({ message: 'Invalid password!' });
  }
});

// refresh token endpoint
app.post('/token', async (req, res) => {
  const email = req.body.email;
  const refreshToken = req.body.refreshToken;
  const result = await User.findAll({
    where: {
      email: req.body.email,
    },
  });
  const userModel = result[0];
  if (refreshToken === userModel.refreshToken) {
    const userObject = {
      username: userModel.username,
      email: userModel.email,
      role: DEFAULT_ROLE,
    };
    const accessToken = jwt.sign(userObject, SECRET, { expiresIn: '3h' });
    const newRefreshToken = jwt.sign(userObject, REFRESH_SECRET, { expiresIn: '7d' });
    res.json({ accessToken: `JWT${accessToken}`, newRefreshToken });
    await userModel.update({
      refreshToken: newRefreshToken,
    });
    res.status(201).send('JTW token updated!');
  } else {
    res.status(401).json({ message: 'Invalid refresh token!' });
  }
});

function validateToken(req, res, next) {
  // get token from the request header
  // request header contains token in the format Bearer <token>
  const authHeader = req.headers['authorization'];
  const token = authHeader.split(' ')[1];

  if (!token) {
    res.sendStatus(400).send('Token not present!');
  }

  jwt.verify(token, SECRET, (err, user) => {
    if (err) {
      res.sendStatus(403).send('Token invalid!');
    } else {
      req.user = user;
      next();
    }
  });
}

app.get('/test-some-protected-route', validateToken, (req, res) => {
  console.log('Valid token!');
  console.log(req.user.user);
  res.send(`${req.user.user} successfully accessed post`);
});
//                      OAuth 2.0 Protocol flow
// +--------+                                           +---------------+
// |        |--(A)------- Authorization Grant --------->|               |
// |        |                                           |               |
// |        |<-(B)----------- Access Token -------------|               |
// |        |               & Refresh Token             |               |
// |        |                                           |               |
// |        |                            +----------+   |               |
// |        |--(C)---- Access Token ---->|          |   |               |
// |        |                            |          |   |               |
// |        |<-(D)- Protected Resource --| Resource |   | Authorization |
// | Client |                            |  Server  |   |     Server    |
// |        |--(E)---- Access Token ---->|          |   |               |
// |        |                            |          |   |               |
// |        |<-(F)- Invalid Token Error -|          |   |               |
// |        |                            +----------+   |               |
// |        |                                           |               |
// |        |--(G)----------- Refresh Token ----------->|               |
// |        |                                           |               |
// |        |<-(H)----------- Access Token -------------|               |
// +--------+           & Optional Refresh Token        +---------------+

(async () => {
  await initializeDb();
  http.createServer({}, app).listen(4000);
})();
