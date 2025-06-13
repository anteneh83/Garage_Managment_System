// src/controllers/invoiceController.js
const Invoice = require('../models/Invoice');

exports.createInvoice = async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    invoice.totalAmount = invoice.items.reduce((acc, item) => acc + item.total, 0) + invoice.laborCost;
    const saved = await invoice.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find()
      .populate('customerId', 'fullName phone')
      .populate('repairId', 'description status');
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customerId')
      .populate('repairId');
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePaymentStatus = async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { paymentStatus: req.body.paymentStatus },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
