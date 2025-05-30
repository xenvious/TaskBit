const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM employees');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM employees WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { first_name, last_name, email, job_title, department, phone, hire_date, role_id } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO employees 
      (first_name, last_name, email, job_title, department, phone, hire_date, role_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *`,
      [first_name, last_name, email, job_title, department, phone, hire_date, role_id]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { first_name, last_name, email, job_title, department, phone, hire_date, is_active, role_id } = req.body;
    const { rows } = await pool.query(
      `UPDATE employees SET
        first_name=$1, last_name=$2, email=$3, job_title=$4, department=$5,
        phone=$6, hire_date=$7, is_active=$8, role_id=$9
       WHERE id=$10
       RETURNING *`,
      [first_name, last_name, email, job_title, department, phone, hire_date, is_active, role_id, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee deleted', employee: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
