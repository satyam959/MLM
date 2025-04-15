import TransactionRepository from '../Repositories/TransactionRepository.mjs';

class TransactionController {
  // Create a new transaction
  static async create(req, res) {
    try {
      const newTransaction = await TransactionRepository.create(req.body);
      res.status(201).json(newTransaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Get all transactions
  static async findAll(req, res) {
    try {
      const transactions = await TransactionRepository.findAll();
      res.status(200).json(transactions);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Get a transaction by ID
  static async findById(req, res) {
    try {
      const transaction = await TransactionRepository.findById(req.params.id);
      res.status(200).json(transaction);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  // Update a transaction
  static async update(req, res) {
    try {
      const updatedTransaction = await TransactionRepository.update(req.params.id, req.body);
      res.status(200).json(updatedTransaction);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  // Delete a transaction
  static async delete(req, res) {
    try {
      const deletedTransaction = await TransactionRepository.delete(req.params.id);
      res.status(200).json(deletedTransaction);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
}

export default TransactionController;
