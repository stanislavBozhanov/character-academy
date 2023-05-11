const express = require('express');
const router = express.Router();
const { Workout } = require('../models/workout');
const { workoutDifficulty } = require('../models/enums');

router.post('/create', async (req, res) => {
  if (!req.body || !req.body.name) {
    res.status(400).json({ message: 'Missing workout details!' });
    return;
  }

  if (Object.values(workoutDifficulty).indexOf(req.body.difficulty) === -1) {
    res.status(400).json({ message: 'Invalid difficulty!' });
    return;
  }

  // write a serializer for this
  try {
    await Workout.create(req.body);
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(201).json({ message: 'Exercise successfully created!' });
  return;
});

module.exports = router;
