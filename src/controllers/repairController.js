const Repair = require('../models/Repair');

exports.createRepair = async (req, res) => {
  try {
    const repair = new Repair(req.body);
    const saved = await repair.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRepairs = async (req, res) => {
  try {
    const repairs = await Repair.find()
      .populate('vehicleId', 'make model registrationNumber')
      .populate('technicianId', 'username role');
    res.json(repairs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getRepairById = async (req, res) => {
  try {
    const repair = await Repair.findById(req.params.id);
    if (!repair) return res.status(404).json({ error: 'Repair not found' });
    res.json(repair);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateRepair = async (req, res) => {
  try {
    const updated = await Repair.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Repair not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteRepair = async (req, res) => {
  try {
    const deleted = await Repair.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Repair not found' });
    res.json({ message: 'Repair deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
