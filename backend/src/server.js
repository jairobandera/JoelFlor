require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const giftRoutes = require('./routes/giftRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/gifts', giftRoutes);

app.use(express.static(path.join(__dirname, '../../frontend/public')));

app.get('/admin-florencia-2025', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/admin.html'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🎉 Server running on http://localhost:${PORT}`);
  console.log(` Admin panel: http://localhost:${PORT}/admin-florencia-2025`);
});
