const express = require('express');
const router = express.Router();
const { Exercise } = require('./models/index.js');

router.post('/add', async (req, res) => {
  if (!req.body || !req.body.name) {
    res.status(400).json({ message: 'Missing workout details!' });
    return;
  }

  // write a serializer for this
  try {
    const name = req.body.name;
    const abbreviation = req.body.abbreviation;
    const difficulty = req.body.difficulty;
    const notes = req.body.notes;

    await Exercise.create({
      name: name,
      abbreviation: abbreviation,
      difficulty: difficulty,
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
