const express = require('express');
const router = express.Router();
const { Exercise } = require('../models/exercise');
const { exerciseDifficulty } = require('../models/enums');

router.post('/add', async (req, res) => {
  if (!req.body || !req.body.name || !req.body.abbreviation) {
    res.status(400).json({ message: 'Missing exercise details!' });
    return;
  }

  if (Object.values(exerciseDifficulty).indexOf(req.body.difficulty) === -1) {
    res.status(400).json({ message: 'Invalid difficulty!' });
    return;
  }

  // write a serializer for this
  try {
    await Exercise.create(req.body);
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(201).json({ message: 'Exercise successfully created!' });
  return;
});

router.get('/all', async (req, res) => {
  const exercises = await Exercise.findAll();
  res.status(200).json(exercises);
});

module.exports = router;
