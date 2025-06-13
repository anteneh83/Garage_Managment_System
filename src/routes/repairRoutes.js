const express = require('express');
const router = express.Router();
const {
  createRepair,
  getAllRepairs,
  getRepairById,
  updateRepair,
  deleteRepair
} = require('../controllers/repairController');

const protect = require('../middlewares/authMiddleware');

router.post('/', protect, createRepair);
router.get('/', protect, getAllRepairs);
router.get('/:id', protect, getRepairById);
router.put('/:id', protect, updateRepair);
router.delete('/:id', protect, deleteRepair);

module.exports = router;
