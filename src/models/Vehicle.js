const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  vin: { type: String, required: true, unique: true },
  registrationNumber: { type: String, required: true },
  status: { type: String, enum: ['active', 'archived'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
