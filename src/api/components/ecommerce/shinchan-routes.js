const express = require('express');
const router = express.Router();
const shinchanController = require('../controllers/shinchan-controller');

// Endpoint yang akan digunakan untuk CRUD (Create, Read, Update, Delete)
router.post('/', shinchanController.createShinchan);
router.get('/:id', shinchanController.getShinchan);
router.put('/:id', shinchanController.updateShinchan);
router.delete('/:id', shinchanController.deleteShinchan);

module.exports = router;
