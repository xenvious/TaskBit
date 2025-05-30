const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
    const { status, priority } = req.query;
    let query = 'SELECT * FROM tasks';
    let params = [];
    let whereClauses = [];
    if (status) {
      params.push(status);
      whereClauses.push(`status = $${params.length}`);
    }
    if (priority) {
      params.push(priority);
      whereClauses.push(`priority = $${params.length}`);
    }
    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }
    query += ' ORDER BY id DESC';
    try {
      const result = await pool.query(query, params);
      res.json(result.rows);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.post('/', async (req, res) => {
    const { title, description, status, priority, due_date, assigned_to, comments } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required!' });
    }
    try {
      const result = await pool.query(
        `INSERT INTO tasks (title, description, status, priority, due_date, assigned_to, comments) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [title, description, status, priority, due_date, assigned_to, comments]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
  router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status, priority, due_date, assigned_to, comments } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    try {
      const result = await pool.query(
        `UPDATE tasks 
         SET title=$1, description=$2, status=$3, priority=$4, due_date=$5, assigned_to=$6, comments=$7, updated_at=NOW()
         WHERE id=$8 RETURNING *`,
        [title, description, status, priority, due_date, assigned_to, comments, id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json(result.rows[0]);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await pool.query('DELETE FROM tasks WHERE id=$1 RETURNING *', [id]);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Task not found' });
      }
      res.json({ message: 'Task deleted' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

module.exports = router;
