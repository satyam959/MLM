import RoyaltyRepository from '../Repositories/RoyaltyRepository.mjs';


class RoyaltyController {
  // Create a new royalty
  static async create(req, res) {
    try {
      const newRoyalty = await RoyaltyRepository.create(req.body);
      res.status(201).json(newRoyalty);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all royalties
  static async findAll(req, res) {
    try {
      const royalties = await RoyaltyRepository.findAll();
      res.status(200).json(royalties);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get a royalty by ID
  static async findById(req, res) {
    try {
      const royalty = await RoyaltyRepository.findById(req.params.id);
      res.status(200).json(royalty);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Update a royalty
  static async update(req, res) {
    try {
      const updatedRoyalty = await RoyaltyRepository.update(req.params.royaltyId, req.body);
      res.status(200).json(updatedRoyalty);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a royalty
  static async delete(req, res) {
    try {
      const deletedRoyalty = await RoyaltyRepository.delete(req.params.royaltyId);
      res.status(200).json(deletedRoyalty);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default RoyaltyController;
