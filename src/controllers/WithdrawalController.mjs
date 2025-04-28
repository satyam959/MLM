import WalletRepository from '../Repositories/WalletRepositories.mjs';

class WithdrawalController {

  // Deposit amount to Wallet
  async deposit(req, res) {
    try {
      const { walletId, amount } = req.body;

      if (!walletId || !amount) {
        return res.status(400).json({ message: 'walletId and amount are required.' });
      }

      let wallet = await WalletRepository.findByWalletId(walletId);

      if (!wallet) {
       
        wallet = await WalletRepository.createWallet({ walletId, balance: 0 });
      }

      const newBalance = wallet.balance + amount;
      const updatedWallet = await WalletRepository.updateBalance(walletId, newBalance);

      res.status(200).json({
        message: 'Amount deposited successfully.',
        wallet: updatedWallet,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Withdraw amount from Wallet
  async withdraw(req, res) {
    try {
      const { walletId, amount } = req.body;

      if (!walletId || !amount) {
        return res.status(400).json({ message: 'walletId and amount are required.' });
      }

      const wallet = await WalletRepository.findByWalletId(walletId);

      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found.' });
      }

      if (wallet.balance < amount) {
        return res.status(400).json({ message: 'Insufficient balance.' });
      }

      const newBalance = wallet.balance - amount;
      const updatedWallet = await WalletRepository.updateBalance(walletId, newBalance);

      res.status(200).json({
        message: 'Amount withdrawn successfully.',
        wallet: updatedWallet,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  // Get Wallet Balance
  async getBalance(req, res) {
    try {
      const { walletId } = req.params;

      if (!walletId) {
        return res.status(400).json({ message: 'walletId is required.' });
      }

      const wallet = await WalletRepository.findByWalletId(walletId);

      if (!wallet) {
        return res.status(404).json({ message: 'Wallet not found.' });
      }

      res.status(200).json({
        balance: wallet.balance
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}

export default new WithdrawalController();
