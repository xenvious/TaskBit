const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET all comments for a task
router.get('/:taskId/comments', async (req, res) => {
  const { taskId } = req.params;
  try {
    const { rows } = await pool.query(
      'SELECT c.*, e.first_name, e.last_name FROM comments c LEFT JOIN employees e ON c.author_id = e.id WHERE c.task_id = $1 ORDER BY c.created_at ASC',
      [taskId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a comment on a task
router.post('/:taskId/comments', async (req, res) => {
  const { taskId } = req.params;
  const { author_id, content } = req.body;
  if (!content) return res.status(400).json({ error: 'Content is required' });
  try {
    const { rows } = await pool.query(
      'INSERT INTO comments (task_id, author_id, content) VALUES ($1, $2, $3) RETURNING *',
      [taskId, author_id, content]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
