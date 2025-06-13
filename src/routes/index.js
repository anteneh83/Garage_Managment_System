const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/vehicles', require('./vehicleRoutes'));
router.use('/repairs', require('./repairRoutes'));
router.use('/customers', require('./customerRoutes'))
router.use('/inventory', require('./inventoryRoutes'));
router.use('/invoices', require('./invoiceRoutes'));
router.use('/assignments', require('./assignmentRoutes'));
// more modules will be added here later

module.exports = router;
