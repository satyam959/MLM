import WalletHistories from "../../Models/WalletHistory.mjs";

class WalletController {
  async getMonthlyIncomeSummary(req, res) {
    try {
      const { month } = req.query;
      const userIdNum = req.user?.userId;

      if (!userIdNum || !month) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Month (YYYY-MM) is required and valid token must be provided",
        });
      }

      const [year, monthPart] = month.split("-");
      const monthPadded = monthPart.padStart(2, "0");

      const startOfMonth = new Date(`${year}-${monthPadded}-01T00:00:00.000Z`);
      if (isNaN(startOfMonth.getTime())) {
        return res.status(400).json({
          success: false,
          statusCode: 400,
          message: "Invalid month format, use YYYY-MM",
        });
      }

      const endOfMonth = new Date(
        new Date(startOfMonth).setMonth(startOfMonth.getMonth() + 1)
      );

      const allTransactions = await WalletHistories.find({
        userId: userIdNum,
        type: "credit",
        status: "completed",
        createdAt: { $gte: startOfMonth, $lt: endOfMonth },
      }).sort({ createdAt: 1 });

      let runningTotal = 0;
      const dailyBreakdown = [];

      for (const tx of allTransactions) {
        const dateKey = new Date(tx.createdAt)
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-");

        const amount = parseFloat(tx.amount);
        if (isNaN(amount)) continue;

        runningTotal += amount;

        dailyBreakdown.push({
          date: dateKey,
          dailyIncome: amount,
          totalIncomeTillDate: runningTotal,
        });
      }

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          month: `${year}-${monthPadded}`,
          totalMonthlyIncome: runningTotal,
          dailyBreakdown,
        },
      });
    } catch (error) {
      console.error(
        "Error in getMonthlyIncomeSummary:",
        error.message,
        error.stack
      );
      return res.status(500).json({
        success: false,
        statusCode: 500,
        message: "Internal server error",
      });
    }
  }
}

export default new WalletController();
