import walletRepo from "../../Repositories/WalletRepositories.mjs";

class LevelIncomeController {
  async getWalletSummary(req, res) {
    try {
      const userId = req.user.userId;
        const totalAmount = (await walletRepo.getTotalWalletAmount(userId)) ?? 0;
        const userLevel = await walletRepo.getUserLevel(userId); 
  
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Wallet summary fetched successfully",
        data: {
          totalAmount,
          directIncome: "70%",
          teamIncome: "30%",
          level: userLevel, 
        },
      });
    } catch (error) {
      res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  }
  
}

export default new LevelIncomeController();
