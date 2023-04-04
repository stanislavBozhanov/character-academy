const express = require('express');
const router = express.Router();
const { Exercise, difficultyEnum } = require('../models/exercise');

router.post('/add', async (req, res) => {
  if (!req.body || !req.body.name || !req.body.abbreviation) {
    res.status(400).json({ message: 'Missing exercise details!' });
    return;
  }

  if (Object.values(difficultyEnum).indexOf(req.body.difficulty) === -1) {
    res.status(400).json({ message: 'Invalid difficulty!' });
    return;
  }

  // write a serializer for this
  try {
    const name = req.body.name;
    const abbreviation = req.body.abbreviation;
    const difficulty = req.body.difficulty;
    const muscleGroup = req.body.muscleGroup;
    const variation = req.body.variation;
    const notes = req.body.notes;

    await Exercise.create({
      name: name,
      abbreviation: abbreviation,
      difficulty: difficulty,
      muscleGroup: muscleGroup,
      variation: variation,
      notes: notes,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(201).json({ message: 'Exercise successfully created!' });
  return;
});

module.exports = router;
