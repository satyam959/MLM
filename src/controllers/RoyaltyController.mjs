import RoyaltyRepository from '../Repositories/RoyaltyRepository.mjs';


class RoyaltyController {
 // Create a new royalty
static async create(req, res) {
  try {
    const newRoyalty = await RoyaltyRepository.create(req.body);

    res.status(201).json({
      message: 'Royalty created successfully.',
      data: newRoyalty,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create royalty.',
      error: error.message,
    });
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

    if (!updatedRoyalty) {
      return res.status(404).json({
        message: 'Royalty not found. Update failed.',
      });
    }

    res.status(200).json({
      message: 'Royalty updated successfully.',
      data: updatedRoyalty,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update royalty.',
      error: error.message,
    });
  }
}

// Delete a royalty
static async delete(req, res) {
  try {
    const deletedRoyalty = await RoyaltyRepository.delete(req.params.royaltyId);

    if (!deletedRoyalty) {
      return res.status(404).json({
        message: 'Royalty not found. Deletion failed.',
      });
    }

    res.status(200).json({
      message: 'Royalty deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete royalty.',
      error: error.message,
    });
  }
}
}

export default RoyaltyController;
