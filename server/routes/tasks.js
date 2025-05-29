const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
    const { title, description, status, priority, due_date } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required!' });
    }
    try {
      const result = await pool.query(
        `INSERT INTO tasks (title, description, status, priority, due_date) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [title, description, status, priority, due_date]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
