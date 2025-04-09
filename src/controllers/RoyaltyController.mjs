import RoyaltyModel from '../Models/RoyaltyModel.mjs';

class RoyaltyController {
  // GET all
  async getAll(req, res) {
    try {
      const data = await RoyaltyModel.find();
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }

  // GET by ID
  async getById(req, res) {
    try {
      const data = await RoyaltyModel.findById(req.params.id);
      if (!data) return res.status(404).json({ message: 'Rank not found' });
      res.json(data);
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }

  // CREATE
  async create(req, res) {
    try {
      const { rank, dailyRoyalty,  } = req.body;
      if (!rank || dailyRoyalty == null) {
        return res.status(400).json({ message: 'rank and dailyRoyalty are required' });
      }

      const newRoyalty = new RoyaltyModel({ rank, dailyRoyalty,  });
      const saved = await newRoyalty.save();
      res.status(201).json(saved);
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }

  // UPDATE
  async update(req, res) {
    try {
      const updated = await RoyaltyModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updated) return res.status(404).json({ message: 'Rank not found' });
      res.json(updated);
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }

  // DELETE
  async delete(req, res) {
    try {
      const deleted = await RoyaltyModel.findByIdAndDelete(req.params.id);
      if (!deleted) return res.status(404).json({ message: 'Rank not found' });
      res.json({ message: 'Deleted successfully', data: deleted });
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  }
}

export default new RoyaltyController();
