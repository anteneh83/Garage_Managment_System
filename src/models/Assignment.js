const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  repairId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repair', required: true },
  status: {
    type: String,
    enum: ['assigned', 'in_progress', 'completed'],
    default: 'assigned'
  },
  assignedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', assignmentSchema);
