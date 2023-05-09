require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const { initializeDb } = require('./db/sync');
const authRoutes = require('./routes/auth');
const exerciseRoutes = require('./routes/exercise');
const workoutRoutes = require('./routes/workout');

const SECRET = process.env.SECRET;
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors()); // cors is enabled for all requests and all origins
app.use(passport.initialize());
app.use(express.json()); // So we can pull req.body.<params>
app.use(authRoutes);
app.use('/exercise', exerciseRoutes);
// app.use('/workout', workoutRoutes);

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

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

(async () => {
  await initializeDb();
  http.createServer({}, app).listen(PORT);
})();
