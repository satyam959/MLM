import WalletHistories from "../../Models/WalletHistory.mjs";
import UserModel from "../../Models/UserModels.mjs";

class WalletController {
  async getAllUsersMonthlyReward(req, res) {
    try {
      const { month } = req.query;

      if (!month) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Month (YYYY-MM) is required",
        });
      }

      const [year, monthPart] = month.split("-");
      const monthPadded = monthPart.padStart(2, "0");
      const startOfMonth = new Date(`${year}-${monthPadded}-01T00:00:00.000Z`);
      const endOfMonth = new Date(new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1));

      if (isNaN(startOfMonth.getTime())) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Invalid month format. Use YYYY-MM",
        });
      }

      const transactions = await WalletHistories.find({
        type: "credit",
        status: "completed",
        transactionType: "monthlyReward",
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      }).lean();

      const userMap = new Map();

      for (const tx of transactions) {
        const userId = tx.userId;
        const amount = parseFloat(tx.amount) || 0;
        const createdAt = new Date(tx.createdAt);

        const istDate = new Date(createdAt.getTime() + 5.5 * 60 * 60 * 1000);
        const dateTimeStr = istDate.toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace(",", "")     
        .replace(/\//g, "-");  
        
        if (!userMap.has(userId)) {
          userMap.set(userId, {
            userId,
            totalMonthlyIncome: 0,
            dailyBreakdown: [],
          });
        }

        const userData = userMap.get(userId);
        userData.totalMonthlyIncome += amount;
        userData.dailyBreakdown.push({
          date: dateTimeStr,
          dailyIncome: amount,
        });
      }

      const userIds = Array.from(userMap.keys());
      const users = await UserModel.find(
        { userId: { $in: userIds } },
        { userId: 1, fullName: 1 }
      ).lean();

      const finalData = Array.from(userMap.values()).map((entry) => {
        const user = users.find((u) => u.userId === entry.userId);
        return {
          userId: entry.userId,
          fullName: user?.fullName || "",
          totalMonthlyIncome: entry.totalMonthlyIncome,
          dailyBreakdown: entry.dailyBreakdown,
        };
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        message: `Monthly reward data fetched successfully for ${month}`,
        data: {
          month: `${year}-${monthPadded}`,
          users: finalData,
        },
      });
    } catch (error) {
      console.error("Error in getAllUsersMonthlyReward:", error.message);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
}

export default new WalletController();
