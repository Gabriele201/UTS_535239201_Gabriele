const shinchanService = require('../services/shinchan-service');

const shinchanController = {
  // Untuk endpoint pada create barang di e-commerce.
  createShinchan: async (req, res) => {
    try {
      const shinchan = await shinchanService.createShinchan(req.body);
      res.json(shinchan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Untuk endpoint pada read barang di e-commerce.
  getShinchan: async (req, res) => {
    try {
      const shinchan = await shinchanService.getShinchan(req.params.id);
      res.json(shinchan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Untuk endpoint pada update barang di e-commerce.
  updateShinchan: async (req, res) => {
    try {
      const shinchan = await shinchanService.updateShinchan(
        req.params.id,
        req.body
      );
      res.json(shinchan);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  // Untuk endpoint pada delete barang di e-commerce.
  deleteShinchan: async (req, res) => {
    try {
      await shinchanService.deleteShinchan(req.params.id);
      res.json({ message: 'Shinchan deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = shinchanController;
