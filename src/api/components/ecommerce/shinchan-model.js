const mongoose = require('mongoose');

// Membuat schema yang akan digunakan pada e-commerce Shinchan ini.
const shinchanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Shinchan = mongoose.model('Shinchan', shinchanSchema);

module.exports = Shinchan;
