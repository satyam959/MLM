import RankRepository from '../Repositories/RankRepository.mjs';
import mongoose from 'mongoose';
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
      const rank = await RankRepository.findById(req.params.rankId);
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

 // Update by custom rankId
 static async update(req, res) {
  try {
    const { rankId } = req.params;
    const updatedRank = await RankRepository.update(rankId, req.body);

    res.status(200).json({
      message: 'Rank updated successfully.',
      data: updatedRank,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to update rank.',
      error: error.message,
    });
  }
}

// Delete by custom rankId
static async delete(req, res) {
  try {
    const { rankId } = req.params;
    await RankRepository.delete(rankId);

    res.status(200).json({
      message: 'Rank deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete rank.',
      error: error.message,
    });
  }
}
}

export default RankController;
