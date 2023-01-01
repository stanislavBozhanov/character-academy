require('dotenv').config();
const express = require('express');
const http = require('http');
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
app.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400).send('Missing username or password');
  }

  const username = req.body.username;
  const password = req.body.password.toString();

  // check if username already exists and throw an error response

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512');

  users.push({ username, passwordHash, salt }); // create user object in the DB

  await User.create({
    username: username,
    passwordHash: passwordHash,
    salt: salt,
  });

  res.status(201).send(users);

  console.log(users);
});

// Login and return token
app.post('/login', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    res.sendStatus(400).send('Missing username or password');
  }

  const result = await User.findAll({
    where: {
      username: req.body.username,
    },
  });
  const userModel = result[0];
  if (!userModel) {
    res.status(404).send('User does not exits!');
  }
  const userData = userModel.dataValues;
  const password = req.body.password.toString();
  const newHash = crypto.pbkdf2Sync(password, userData.salt, 100000, 512, 'sha512');

  // check if you can compare buffers directly for better efficiency
  if (userData.passwordHash.toString('hex') === newHash.toString('hex')) {
    const role = 'admin'; // just testing some stuff later we will have 2 roles in the app
    const userObject = {
      username: req.body.username,
      role: role,
    };
    const accessToken = jwt.sign(userObject, SECRET, { expiresIn: '3h' });
    const refreshToken = jwt.sign(userObject, REFRESH_SECRET, { expiresIn: '7d' });
    await userModel.update({
      refreshToken: refreshToken,
    });
    res.json({ accessToken: `JTW${accessToken}`, refreshToken });
  } else {
    res.sendStatus(401);
  }
});

// refresh token endpoint
app.post('/token', (req, res) => {
  const username = req.body.username;
  const refreshToken = req.body.refreshToken;
  if (refreshToken in refreshTokens && refreshTokens[refreshToken] === username) {
    const userObject = {
      username,
      role: 'admin',
    };
    const accessToken = jwt.sign(userObject, SECRET, { expiresIn: '3h' });
    const newRefreshToken = jwt.sign(userObject, REFRESH_SECRET, { expiresIn: '7d' });
    res.json({ accessToken: `JWT${accessToken}`, newRefreshToken });
    delete refreshTokens[refreshToken];
    refreshTokens[newRefreshToken] = username;
  } else {
    res.sendStatus(401);
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
