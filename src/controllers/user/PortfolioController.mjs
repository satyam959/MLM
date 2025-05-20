import UserRepository from "../../Repositories/user/userRepositories.mjs";
import UserWalletRepository from "../../Repositories/user/userWalletRepositories.mjs";
import RankRepository from "../../Repositories/RankRepository.mjs";

class PortfolioController {
  static async getUserPortfolio(req, res) {
    try {
      const userTokenData = req.user;

      // 🟢 Step 1: Get user details
      const userDetails = await UserRepository.getUserDetails(
        userTokenData.userId
      );
      const walletBalance = await UserWalletRepository.findWalletByUserId(
        userTokenData.userId
      );
      const teamCount = await UserRepository.getTotalCountUserDownlines(
        userTokenData.userId
      );

      let rankName = "";

      if (userDetails.rankId && userDetails.rankId != undefined ) {
        try {
          const rankDetails = await RankRepository.findById(userDetails.rankId);
          console.log("✅ Rank fetched:", rankDetails);
          rankName = rankDetails?.name || "Not Assigned";
        } catch (err) {
          console.warn("❌ Error fetching rank:", err.message);
        }
      } else {
        rankName = '';
      }

      // ✅ Step 3: Return final response
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "User portfolio retrieved successfully",
        data: {
          user: {
            userImage: userDetails.image,
            name: userDetails.fullName,
            email: userDetails.email,
            rank: rankName, // ✅ Rank name included here
            totalEarning: walletBalance?.balance ?? 0,
            isPrime: userDetails.membership.type == 1,
          },
          royaltyIncome: {
            balance: 0,
          },
          team: {
            total: teamCount.total,
            active: teamCount.active,
            inActive: teamCount.nonActive,
          },
        },
      });
    } catch (error) {
      console.error("Error in getUserPortfolio:", error.message);
      res.status(500).json({
        message: "Error fetching user portfolio",
        error: error.message,
      });
    }
  }
}

export default PortfolioController;
