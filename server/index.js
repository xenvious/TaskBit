require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const tasksRouter = require('./routes/tasks');

app.use(cors());
app.use(express.json());

app.use('/api/tasks', tasksRouter);
app.use('/api/employees', require('./routes/employees'));
app.use('/api/roles', require('./routes/roles'));

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
