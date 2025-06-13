const mongoose = require('mongoose');

const invoiceSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  repairId: { type: mongoose.Schema.Types.ObjectId, ref: 'Repair', required: true },
  items: [{
    name: String,
    quantity: Number,
    price: Number,
    total: Number
  }],
  laborCost: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'pending'], default: 'unpaid' },
  paymentMethod: { type: String, enum: ['cash', 'card', 'telebirr', 'check'], default: 'cash' },
  issuedAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
