const express = require('express');
const mongoose = require('mongoose');
const shinchanRoutes = require('./ecommerce/routes/shinchan-routes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = 'mongodb://localhost:27017/shinchan-api';

// Menhubungkan konseksi ke MongoDB.
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Berhasil terhubung ke MongoDB'))
  .catch((err) => console.error('Gagal terhubung ke MongoDB', err));

app.use(express.json());

// Membuat middleware untuk menangani route e-commerce Shinchan.
app.use('/api/shinchan', shinchanRoutes);

// Declare server berhasil jalan di port yang sesuai.
app.listen(PORT, () =>
  console.log(`Server berjalan di http://localhost:${PORT}`)
);
