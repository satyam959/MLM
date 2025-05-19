import WalletHistories from "../../Models/WalletHistory.mjs";

class WalletController {
  async getIncomeTransactions(req, res) {
    try {
      const userIdNum = req.user?.userId;

      if (!userIdNum) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Valid token must be provided",
        });
      }

      const transactions = await WalletHistories.find({
        userId: userIdNum,
        type: "credit",
        status: "completed",
      }).sort({ createdAt: 1 });

      if (!transactions.length) {
        return res.status(200).json({
          success: true,
          statusCode: 200,
          data: [],
          message: "No income data found for this user",
        });
      }

      let totalIncome = 0;
      const data = transactions.map((tx) => {
        const createdDate = new Date(tx.createdAt);
        const month = `${createdDate.getFullYear()}-${String(createdDate.getMonth() + 1).padStart(2, "0")}`;
        const date = createdDate.toLocaleDateString("en-GB").replace(/\//g, "-");
        const amount = parseFloat(tx.amount) || 0;

        totalIncome += amount;

        return {
          month,
          date,
          dailyIncome: amount,
          totalIncomeTillDate: totalIncome,
          transactionId: tx.transactionId,
          transactionType: tx.transactionType,
          source: tx.source,
          walletHistoryId: tx.walletHistoryId,
        };
      });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data,
      });
    } catch (error) {
      console.error("Error in getIncomeTransactions:", error.message, error.stack);
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
}

export default new WalletController();
