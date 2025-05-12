import walletRepo from "../../Repositories/WalletRepositories.mjs";
import userRepository from "../../Repositories/user/userRepositories.mjs";
import TeamRepositories from "../../Repositories/user/TeamRepositories.mjs";

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

      // Get user details
      const userDetails = await userRepo.getUserById(userId);
      const walletBalance = await walletRepo.getTotalWalletAmount(userId);
      const teamCount = await teamRepo.getTeamCount(userId); 

      res.json({
        success: true,
        data: {
          userInfo: {
            userImage: userDetails.image,
            name: userDetails.fullName,
            email: userDetails.email,
            rank: userDetails.rank,
            totalEarning: walletBalance ?? 0
          },
          royaltyIncome: {
            balance: 0 
          },
          team: {
            total: teamCount.total,
            active: teamCount.active,
            inActive: teamCount.nonActive
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
  }
}


export default new LevelIncomeController();
