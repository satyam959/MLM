import WalletRepository from "../../Repositories/WalletRepositories.mjs";
import UserRepository from "../../Repositories/UserRepository.mjs";

class LevelIncomeController {
  async getWalletSummary(req, res) {
    try {
      const userId = req.user.userId;

      // ✅ Get wallet by userId (No wallet creation here, just fetching)
      const wallet = await WalletRepository.findByUserId(userId);
      console.log("wallet", wallet); // Debugging log

      // Check if wallet exists
      if (!wallet) {
        return res.status(404).json({
          statusCode: 404,
          success: false,
          message: "Wallet not found",
        });
      }

      const totalAmount = wallet.balance; // Ensure you're accessing the correct field

      // ✅ Get user level safely
      const user = await UserRepository.findByUserId(userId);
      const userLevel = user?.level ?? 1;

      // Respond with wallet data and user level
      return res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Wallet summary fetched successfully",
        data: {
          totalAmount,  // This will now reflect the correct balance from the existing wallet
          directIncome: "70%",  // Hardcoded value as per your original logic
          teamIncome: "30%",    // Hardcoded value as per your original logic
          level: userLevel,
        },
      });
    } catch (error) {
      // Catch errors and return server error message
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Server Error",
        error: error.message,
      });
    }
  }
}

export default new LevelIncomeController();
