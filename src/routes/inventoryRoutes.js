const express = require('express');
const router = express.Router();
const {
  addItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem
} = require('../controllers/inventoryController');

const protect = require('../middlewares/authMiddleware');

router.post('/', protect, addItem);
router.get('/', protect, getAllItems);
router.get('/:id', protect, getItemById);
router.put('/:id', protect, updateItem);
router.delete('/:id', protect, deleteItem);

module.exports = router;
