import RoyaltyRepository from '../Repositories/RoyaltyRepository.mjs';

class RoyaltyController {
  
  // Create a new Royalty
  static async createRoyalty(req, res) {
    try {
      const { rank, dailyRoyalty, status } = req.body;
  
      // Create the new royalty document
      const newRoyalty = await RoyaltyRepository.createRoyalty({ rank, dailyRoyalty, status });
  
      // Return the response with the created royalty document
      res.status(201).json({
        message: 'Royalty created successfully',
        royalty: newRoyalty
      });
    } catch (error) {
      // Return the error message if something goes wrong
      res.status(500).json({
        message: `Error creating royalty: ${error.message}`
      });
    }
  }
  

  // Get all Royalties
  static async getAllRoyalties(req, res) {
    try {
      const royalties = await RoyaltyRepository.getAllRoyalties();
      res.status(200).json(royalties);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get Royalty by ID (royaltyId)
  static async getRoyaltyById(req, res) {
    try {
      const { royaltyId } = req.params;
      const royalty = await RoyaltyRepository.getRoyaltyById(royaltyId);
      
      if (!royalty) {
        return res.status(404).json({ message: 'Royalty not found' });
      }

      res.status(200).json(royalty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async updateRoyaltyById(req, res) {
    try {
      const { royaltyId } = req.params; // royaltyId is passed as a string or number
      const { rank, dailyRoyalty, status } = req.body;
  
      // Find the royalty by the custom royaltyId
      const updatedRoyalty = await RoyaltyRepository.updateRoyaltyById(royaltyId, { rank, dailyRoyalty, status });
  
      if (!updatedRoyalty) {
        return res.status(404).json({ message: 'Royalty not found' });
      }
  
      res.status(200).json(updatedRoyalty);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  

static async deleteRoyaltyById(req, res) {
  try {
    const { royaltyId } = req.params; // royaltyId is passed as a string or number

    // Delete royalty by custom royaltyId
    const result = await RoyaltyRepository.deleteRoyaltyById(royaltyId);

    if (!result) {
      return res.status(404).json({ message: 'Royalty not found' });
    }

    res.status(200).json({ message: 'Royalty deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}


}

export default RoyaltyController;
