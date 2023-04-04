const express = require('express');
const router = express.Router();

router.post('/register', async (req, res) => {
  if (!req.body.username || !req.body.password || !req.body.email) {
    res.status(400).json({ message: 'Missing email, password or username!' });
    return;
  }

  const username = req.body.username.toString();
  const password = req.body.password.toString();
  const email = req.body.email.toString();

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = crypto.pbkdf2Sync(password, salt, 100000, 512, 'sha512');

  const result = await User.findAll({
    where: {
      [Op.or]: [{ email: req.body.email }, { username: req.body.username }],
    },
  });

  if (result.length) {
    res.status(400).json({ message: 'User with that username or email already exists!' });
    return;
  }

  try {
    await User.create({
      username: username,
      email: email,
      passwordHash: passwordHash,
      salt: salt,
      role: DEFAULT_ROLE,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }

  res.status(201).json({ message: 'User successfully created!' });
  return;
});

router.post('/login', async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).json({ message: 'Missing email or password!' });
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
    return;
  }

  const userData = userModel.dataValues;
  const password = req.body.password.toString();
  const newHash = crypto.pbkdf2Sync(password, userData.salt, 100000, 512, 'sha512');

  if (crypto.timingSafeEqual(userData.passwordHash, newHash)) {
    // default role will be user. Admins will be manually created for now
    const userObject = {
      username: userData.username,
      email: userData.email,
      role: DEFAULT_ROLE,
    };
    const accessToken = jwt.sign(userObject, SECRET, { expiresIn: '3h' });
    const refreshToken = jwt.sign(userObject, REFRESH_SECRET, { expiresIn: '7d' });
    await userModel.update({
      refreshToken: refreshToken,
    });
    res.status(200).json({ message: 'Success', accessToken, refreshToken, user: userObject });
  } else {
    res.status(401).json({ message: 'Invalid password!' });
  }
});

// refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  const email = req.body.email;
  const refreshToken = req.body.refreshToken;

  if (!req.body.email || !req.body.refreshToken) {
    res.status(400).json({ message: 'Missing email or refreshToken!' });
    return;
  }

  // verify refresh token
  try {
    data = jwt.verify(refreshToken, REFRESH_SECRET);
  } catch (error) {
    res.status(400).json({ message: error?.message });
    return;
  }

  const result = await User.findAll({
    where: {
      email,
    },
  });
  const userModel = result[0];
  if (refreshToken === userModel.refreshToken) {
    const userObject = {
      username: userModel.username,
      email: userModel.email,
      role: DEFAULT_ROLE,
    };
    const newAccessToken = jwt.sign(userObject, SECRET, { expiresIn: '3h' });
    const newRefreshToken = jwt.sign(userObject, REFRESH_SECRET, { expiresIn: '7d' });
    await userModel.update({
      refreshToken: newRefreshToken,
    });
    res.status(200).json({ message: 'Success', accessToken: newAccessToken, refreshToken: newRefreshToken });
    return;
  } else {
    res.status(400).json({ message: 'Invalid refresh token!' });
    return;
  }
});

module.exports = router;
