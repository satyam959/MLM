import Wallet from '../../Models/WalletModels.mjs';
import WalletHistory from '../../Models/WalletHistory.mjs';
import WalletHistories from '../../Models/WalletHistory.mjs';

const UserWalletRepository = {
    async findWalletByUserId(userId) {
        try {
            return await Wallet.findOne({ userId });
        } catch (error) {
            console.error('Error fetching wallet by userId:', error);
            throw error;
        }
    },

    async createWallet(walletData) {
        const wallet = new Wallet(walletData);
        return await wallet.save();
    },

    async createWalletHistory(walletHistory) {
        const wallet = new WalletHistory(walletHistory);
        return await wallet.save();
    },
    async getUserTransactions(userId, transactionType) {
        return await WalletHistory.aggregate([
          {
            $match: {
              userId: Number(userId),
              transactionType: transactionType,
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "userId",
              as: "userInfo",
            },
          },
          { $unwind: "$userInfo" },
          {
            $addFields: {
              hour: { $hour: { date: "$createdAt", timezone: "Asia/Kolkata" } },
              minute: { $minute: { date: "$createdAt", timezone: "Asia/Kolkata" } },
              second: { $second: { date: "$createdAt", timezone: "Asia/Kolkata" } },
              dateOnly: {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$createdAt",
                  timezone: "Asia/Kolkata"
                }
              },
            },
          },
          {
            $addFields: {
              hour12: {
                $cond: [
                  { $eq: [{ $mod: ["$hour", 12] }, 0] },
                  12,
                  { $mod: ["$hour", 12] }
                ]
              },
              ampm: {
                $cond: [{ $lt: ["$hour", 12] }, "AM", "PM"]
              },
              paddedMinute: {
                $cond: [
                  { $lt: ["$minute", 10] },
                  { $concat: ["0", { $toString: "$minute" }] },
                  { $toString: "$minute" }
                ]
              },
              paddedSecond: {
                $cond: [
                  { $lt: ["$second", 10] },
                  { $concat: ["0", { $toString: "$second" }] },
                  { $toString: "$second" }
                ]
              }
            }
          },
          {
            $project: {
              _id: 0,
              userId: 1,
              fullName: "$userInfo.fullName",
              amount: 1,
              dateTime: {
                $concat: [
                  "$dateOnly",
                  " ",
                  { $toString: "$hour12" },
                  ":",
                  "$paddedMinute",
                  ":",
                  "$paddedSecond",
                  " ",
                  "$ampm"
                ]
              }
            }
          },
          { $sort: { createdAt: -1 } }
        ]);
      }
      
};

export default UserWalletRepository;
