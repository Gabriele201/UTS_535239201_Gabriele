const Shinchan = require('../models/shinchan-model');

const shinchanService = {
  // Untuk endpoint pada create barang di e-commerce.
  createShinchan: async (data) => {
    try {
      const shinchan = new Shinchan(data);
      return await shinchan.save();
    } catch (error) {
      throw error;
    }
  },
  // Untuk endpoint pada read barang di e-commerce.
  getShinchan: async (id) => {
    try {
      return await Shinchan.findById(id);
    } catch (error) {
      throw error;
    }
  },
  // Untuk endpoint pada update barang di e-commerce.
  updateShinchan: async (id, data) => {
    try {
      return await Shinchan.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      throw error;
    }
  },
  // Untuk endpoint pada update barang di e-commerce.
  deleteShinchan: async (id) => {
    try {
      await Shinchan.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  },
};

module.exports = shinchanService;
