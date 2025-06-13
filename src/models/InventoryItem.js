const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['spare_part', 'tool', 'supply'], required: true },
  quantity: { type: Number, required: true, default: 0 },
  reorderLevel: { type: Number, default: 5 },
  supplier: { type: String },
  pricePerUnit: { type: Number, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
