import Transaction from '../Models/TransactionModels.mjs';

class TransactionRepository {
  // Create a new transaction
  static async create(data) {
    try {
      const transaction = new Transaction(data);
      await transaction.save();
      return transaction;
    } catch (error) {
      console.error('Error creating transaction:', error);
      throw new Error('Error creating transaction: ' + error.message);
    }
  }

  // Get all transactions      

  static async findAll() {
    try {
      return await Transaction.find();
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw new Error('Error fetching transactions: ' + error.message);
    }
  }

  // Find transaction by ID
  static async findById(transactionId) {
    try {
      const transaction = await Transaction.findById(transactionId);
      if (!transaction) {
        throw new Error('Transaction not found');
      }
      return transaction;
    } catch (error) {
      console.error('Error finding transaction by ID:', error);
      throw new Error('Error finding transaction: ' + error.message);
    }
  }

  // Update a transaction by ID
  static async update(transactionId, data) {
    try {
      const updated = await Transaction.findByIdAndUpdate(transactionId, data, { new: true });
      if (!updated) {
        throw new Error('Transaction not found for update');
      }
      return updated;
    } catch (error) {
      console.error('Error updating transaction:', error);
      throw new Error('Error updating transaction: ' + error.message);
    }
  }

  // Delete a transaction by ID
  static async delete(transactionId) {
    try {
      const deleted = await Transaction.findByIdAndDelete(transactionId);
      if (!deleted) {
        throw new Error('Transaction not found for deletion');
      }
      return deleted;
    } catch (error) {
      console.error('Error deleting transaction:', error);
      throw new Error('Error deleting transaction: ' + error.message);
    }
  }
}

export default TransactionRepository;
