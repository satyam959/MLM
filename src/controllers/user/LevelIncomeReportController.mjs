import walletRepo from "../repositories/wallet.repo.js";

class LevelIncomeController {
  async getLevelIncomeReport(req, res) {
    try {
      const userId = req.user.userId;
      const data = await walletRepo.getLevelIncomeByUser(userId);
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }

  async getWalletSummary(req, res) {
    try {
      const userId = req.user.userId;
      const totalAmount = await walletRepo.getTotalWalletAmount(userId);
      const directIncome = totalAmount * 0.7;
      const teamIncome = totalAmount * 0.3;

      res.json({
        success: true,
        data: {
          totalAmount,
          directIncome,
          teamIncome
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
}

export default new LevelIncomeController();
