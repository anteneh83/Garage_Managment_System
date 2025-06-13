const Assignment = require('../models/Assignment');

exports.assignTechnician = async (req, res) => {
  try {
    const assignment = new Assignment(req.body);
    const saved = await assignment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find()
      .populate('technicianId', 'username role')
      .populate('repairId', 'description status');
    res.json(assignments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAssignmentStatus = async (req, res) => {
  try {
    const updated = await Assignment.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status, updatedAt: Date.now() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Assignment not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
