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

      const dayMap = new Map();
      let runningTotal = 0;

      for (const tx of allTransactions) {
        const dateKey = new Date(tx.createdAt)
          .toLocaleDateString("en-GB")
          .replace(/\//g, "-");

        const amount = parseFloat(tx.amount);
        if (isNaN(amount)) continue;

        runningTotal += amount;

        if (!dayMap.has(dateKey)) {
          dayMap.set(dateKey, {
            date: dateKey,
            dailyIncome: 0,
          });
        }

        const entry = dayMap.get(dateKey);
        entry.dailyIncome += amount;
      }

      const dailyBreakdown = [];
      let cumulative = 0;
      [...dayMap.entries()]
        .sort((a, b) => {
          const [d1, m1, y1] = a[0].split("-").map(Number);
          const [d2, m2, y2] = b[0].split("-").map(Number);
          return new Date(y1, m1 - 1, d1) - new Date(y2, m2 - 1, d2);
        })
        .forEach(([date, entry]) => {
          cumulative += entry.dailyIncome;
          dailyBreakdown.push({
            date,
            dailyIncome: entry.dailyIncome,
            totalIncomeTillDate: cumulative,
          });
        });

      return res.status(200).json({
        success: true,
        statusCode: 200,
        data: {
          month: `${year}-${monthPadded}`,
          totalMonthlyIncome: cumulative,
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
