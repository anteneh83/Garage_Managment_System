const express = require('express');
const router = express.Router();
const {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle
} = require('../controllers/vehicleController');

const protect = require('../middlewares/authMiddleware');

router.post('/', protect, createVehicle);
router.get('/', protect, getAllVehicles);
router.get('/:id', protect, getVehicleById);
router.put('/:id', protect, updateVehicle);
router.delete('/:id', protect, deleteVehicle);

module.exports = router;
