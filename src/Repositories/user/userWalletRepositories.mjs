import WalletModel from '../../Models/WalletModels.mjs';
import WalletHistoryModel from '../../Models/WalletHistory.mjs';
import UserModel from '../../Models/UserModels.mjs';
const UserWalletRepository = {
  async findWalletByUserId(userId) {
    try {
      return await WalletModel.findOne({ userId });
    } catch (error) {
      console.error('Error fetching wallet by userId:', error);
      throw error;
    }
  },

  async createWallet({ userId, balance }) {
    try {
      const wallet = new WalletModel({ userId, balance });
      return await wallet.save();
    } catch (error) {
      console.error('Error creating wallet:', error);
      throw error;
    }
  },

  async updateUserWallet(userId, updateData) {
    return await WalletModel.findOneAndUpdate({ userId }, updateData, {
      new: true,
      runValidators: true
    });
  },

  async createWalletHistory(historyData) {
    try {
      const history = new WalletHistoryModel(historyData);
      return await history.save();
    } catch (error) {
      console.error('Failed to create wallet history:', error);
      throw error;
    }
  },
  

  async updateWalletHistoryByCustomId(walletHistoryId, updateData) {
    return await WalletHistoryModel.findOneAndUpdate(
      { walletHistoryId: Number(walletHistoryId) },
      updateData,
      { new: true }
    );
  },

  async getUserTransactions(userId, transactionType) {
    return await WalletHistoryModel.aggregate([
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
  },
  // In userWalletRepositories.mjs
 async findUsersWithMembershipAndReferrer() {
    try {
      const users = await UserModel.find({
        'membership.type': 1,
        referredBy: { $exists: true, $ne: null }
      });
  
      console.log("Matching users found:", users.length);
      return users;
    } catch (error) {
      console.error("Error in findUsersWithMembershipAndReferrer:", error.message);
      return [];
    }
  }
}  


export default UserWalletRepository;
