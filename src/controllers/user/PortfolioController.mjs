import UserRepository from "../../Repositories/user/userRepositories.mjs";
import UserWalletRepository from "../../Repositories/user/userWalletRepositories.mjs";
import RankRepository from "../../Repositories/RankRepository.mjs";

class PortfolioController {
  static async getUserPortfolio(req, res) {
    try {
      const userTokenData = req.user;

      // 🟢 Step 1: Get user details
      const userDetails = await UserRepository.getUserDetails(userTokenData.userId);

      if (!userDetails) {
        return res.status(404).json({
          status: false,
          statusCode: 404,
          message: "User not found",
        });
      }

      // Log full user details for debugging
      console.log("UserDetails complete raw data:", JSON.stringify(userDetails, null, 2));

      // Convert to plain object if it's a Mongoose document
      const userObj = userDetails.toObject ? userDetails.toObject() : userDetails;

      // 🟢 Step 2: Get wallet balance
      const walletBalance = await UserWalletRepository.findWalletByUserId(userTokenData.userId);

      // 🟢 Step 3: Get team counts
      const teamCount = await UserRepository.getTotalCountUserDownlines(userTokenData.userId);

      // 🟢 Step 4: Get rank name safely
      let rankName = "";
      if (userObj.rankId) {
        try {
          const rankDetails = await RankRepository.findById(userObj.rankId);
          console.log("✅ Rank fetched:", rankDetails);
          rankName = rankDetails?.name || "Not Assigned";
        } catch (err) {
          console.warn("❌ Error fetching rank:", err.message);
        }
      }

      // 🟢 Step 5: Extract reward and royaltyIncome correctly
      // Check both root level and inside rechargeRecived as fallback
      const rewardRaw = userObj.reward ?? userObj.rechargeRecived?.reward;
      const royaltyIncomeRaw = userObj.royaltyIncome ?? userObj.rechargeRecived?.royaltyIncome;

      // Parse them as numbers safely
      const reward = rewardRaw ? Number(rewardRaw) : 0;
      const royaltyIncome = royaltyIncomeRaw ? Number(royaltyIncomeRaw) : 0;

      console.log("Parsed reward:", reward, "Parsed royaltyIncome:", royaltyIncome);

      // 🟢 Step 6: Return response
      return res.status(200).json({
        status: true,
        statusCode: 200,
        message: "User portfolio retrieved successfully",
        data: {
          user: {
            userImage: userObj.image || "",
            name: userObj.fullName || "",
            email: userObj.email || "",
            rank: rankName,
            totalEarning: walletBalance?.balance ?? 0,
            isPrime: userObj?.membership?.type === 1,
          },
          rechargeRecived: userObj.rechargeRecived || { type: 0, payoutDate: null },
          reward,
          royaltyIncome,
          team: {
            total: teamCount?.total || 0,
            active: teamCount?.active || 0,
            inActive: teamCount?.nonActive || 0,
          },
        },
      });
    } catch (error) {
      console.error("Error in getUserPortfolio:", error.message);
      return res.status(500).json({
        message: "Error fetching user portfolio",
        error: error.message,
      });
    }
  }
}

export default PortfolioController;
