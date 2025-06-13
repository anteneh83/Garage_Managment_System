const express = require('express');
const router = express.Router();
const {
  assignTechnician,
  getAllAssignments,
  updateAssignmentStatus
} = require('../controllers/assignmentController');

const protect = require('../middlewares/authMiddleware');

router.post('/', protect, assignTechnician);
router.get('/', protect, getAllAssignments);
router.put('/:id/status', protect, updateAssignmentStatus);

module.exports = router;
