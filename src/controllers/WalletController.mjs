import walletRepo from '../Repositories/WalletRepositories.mjs';

class WalletController {
  async create(req, res) {
    try {
      const wallet = await walletRepo.createWallet(req.body);
      res.status(201).json(wallet);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async getAll(req, res) {
    try {
      const wallets = await walletRepo.getAllWallets();
      res.status(200).json(wallets);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async getById(req, res) {
    try {
      const wallet = await walletRepo.getWalletById(req.params.id);
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
      }
      res.status(200).json(wallet);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  async update(req, res) {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
      }

      const wallet = await walletRepo.updateWallet(userId, req.body);
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found for this userId' });
      }

      res.status(200).json(wallet);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async delete(req, res) {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
      }

      const wallet = await walletRepo.deleteWallet(userId);
      if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found for this userId' });
      }

      res.status(200).json({ message: 'Wallet deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

export default new WalletController();
