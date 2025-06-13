const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String },
  address: { type: String },
  vehicles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);
