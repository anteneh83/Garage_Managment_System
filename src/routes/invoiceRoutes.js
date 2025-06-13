const express = require('express');
const router = express.Router();
const {
  createInvoice,
  getAllInvoices,
  getInvoiceById,
  updatePaymentStatus
} = require('../controllers/invoiceController');

const protect = require('../middlewares/authMiddleware');

router.post('/', protect, createInvoice);
router.get('/', protect, getAllInvoices);
router.get('/:id', protect, getInvoiceById);
router.put('/:id/payment', protect, updatePaymentStatus);

module.exports = router;
