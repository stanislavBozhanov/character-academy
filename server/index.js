// require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Op = require('Sequelize').Op;
const { initializeDb } = require('./db/sync');
const authRoutes = require('./routes/auth');
const exerciseRoutes = require('./routes/exercise');
const workoutRoutes = require('./routes/workout');

// const port = process.env.TOKEN_SERVER_PORT;
const SECRET = 'Shhhhhhhhhh...very big secret!';
const REFRESH_SECRET = 'Shhhhhhhhhhhhh....another very big secret!';
const DEFAULT_ROLE = 'user';

const app = express();
app.use(cors()); // cors is enabled for all requests and all origins
app.use(passport.initialize());
app.use(express.json()); // So we can pull req.body.<params>
app.use(authRoutes);
app.use('/exercise', exerciseRoutes);
app.use('/workout', workoutRoutes);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: SECRET,
};

const jwtStrategy = new JwtStrategy(jwtOptions, (jwtPayload, done) => {
  // Token expiration is handled in passport.authenticate. Only user validation is done here
  done(null, jwtPayload);
});
passport.use(jwtStrategy);

app.get('/test-api', passport.authenticate('jwt', { session: false }), (req, res) => {
  res.status(200).json({ message: 'Success', user: req.user });
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
