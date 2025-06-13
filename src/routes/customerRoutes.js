const express = require('express');
const router = express.Router();
const {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');

const protect = require('../middlewares/authMiddleware');

router.post('/', protect, createCustomer);
router.get('/', protect, getAllCustomers);
router.get('/:id', protect, getCustomerById);
router.put('/:id', protect, updateCustomer);
router.delete('/:id', protect, deleteCustomer);

module.exports = router;
