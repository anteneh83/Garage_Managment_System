const mongoose = require('mongoose');

const repairSchema = new mongoose.Schema({
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
  technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: { type: String, required: true },
  servicesPerformed: [String],
  partsReplaced: [String],
  cost: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'in_progress', 'completed'], default: 'pending' },
  date: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Repair', repairSchema);
