import RankRepository from '../Repositories/RankRepository.mjs';

class RankController {
  // Create a new rank
  static async create(req, res) {
    try {
      const newRank = await RankRepository.create(req.body);
      res.status(201).json(newRank);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all ranks
  static async findAll(req, res) {
    try {
      const ranks = await RankRepository.findAll();
      res.status(200).json(ranks);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get a rank by ID
  static async findById(req, res) {
    try {
      const rank = await RankRepository.findById(req.params.id);
      res.status(200).json(rank);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

//   // Get a rank by name
//   static async findByName(req, res) {
//     try {
//       const rank = await RankRepository.findByName(req.params.name);
//       res.status(200).json(rank);
//     } catch (error) {
//       res.status(404).json({ error: error.message });
//     }
//   }

  // Update a rank
  static async update(req, res) {
    try {
      const updatedRank = await RankRepository.update(req.params.rankId, req.body);
      res.status(200).json(updatedRank);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a rank
  static async delete(req, res) {
    try {
      const deletedRank = await RankRepository.delete(req.params.rankId);
      res.status(200).json(deletedRank);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default RankController;
