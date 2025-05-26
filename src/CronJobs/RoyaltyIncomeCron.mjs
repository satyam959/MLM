import cron from 'node-cron';
import mongoose from 'mongoose';
import UserModel from '../Models/UserModels.mjs';
import UserWalletRepository from '../Repositories/user/userWalletRepositories.mjs';
import WalletHistories from '../Models/WalletHistory.mjs';
import RankModel from '../Models/RankModels.mjs';
import userRepository from '../Repositories/user/userRepositories.mjs';


const TRANSACTION_TYPE = 'royaltyIncome';

class RoyaltyIncomeCron {
  constructor() {
    this.task = null;
  }

  startCron() {
    if (this.task) {
      console.log('⏳ RoyaltyIncomeCron is already running');
      return;
    }

    this.task = cron.schedule('* * * * *', async () => {
      const now = new Date();
      const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
      console.log(`🕐 Cron Triggered at (IST): ${istNow.toLocaleString()}`);
      console.log('[Cron] Royalty Income started');

      await this.processRoyaltyIncome();

      console.log('[Cron] Royalty Income completed');
    }, {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    });

    console.log('✅ RoyaltyIncomeCron started');
  }

  stopCron() {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log('⏹️ RoyaltyIncomeCron stopped');
    }
  }

  async processRoyaltyIncome() {
    try {
      const now = new Date();
      const adminUserId = await userRepository.getAdminUserId();

      const ranks = await RankModel.find({});
      console.log(`🔍 Found ${ranks.length} ranks from DB`);
  
      // Find users with membership.type=1 and rankId exists and not null
      const users = await UserModel.find({
        'membership.type': 1,
        rankId: { $exists: true, $ne: null },
      });
  
      console.log(`👥 Found ${users.length} users with membership.type=1 and rankId`);
  
      if (users.length === 0) {
        console.log('⚠️ No eligible users found for royalty income');
        return;
      }
  
      // Group users by their rankId
      const usersByRank = {};
      for (const user of users) {
        const rankKey = user.rankId?.toString() || '0'; // fallback '0' if no rankId
        if (!usersByRank[rankKey]) usersByRank[rankKey] = [];
        usersByRank[rankKey].push(user);
      }
  
      const totalRanks = Object.keys(usersByRank).length;
      const totalAmountToDeduct = totalRanks * 80; // ₹80 per rank total pool
  
      const adminWallet = await UserWalletRepository.findWalletByUserId(adminUserId);
      if (!adminWallet) {
        console.log("❌ Admin wallet not found");
        return;
      }
  
      if (adminWallet.balance < totalAmountToDeduct) {
        console.log(`❌ Insufficient balance: Need ₹${totalAmountToDeduct}, available ₹${adminWallet.balance}`);
        return;
      }
  
      // Deduct total amount from admin wallet
      const adminOldBalance = adminWallet.balance;
      adminWallet.balance -= totalAmountToDeduct;
      await adminWallet.save();
  
      await WalletHistories.create({
        userId: adminUserId,
        type: 'debit',
        transactionType: TRANSACTION_TYPE,
        amount: totalAmountToDeduct,
        balanceBefore: adminOldBalance,
        balanceAfter: adminWallet.balance,
        source: 'wallet',
        status: 'completed',
        note: `Royalty pool distributed for ${totalRanks} ranks`,
      });
  
      // Distribute ₹80 per rank equally among users of that rank
      for (const rank in usersByRank) {
        const rankUsers = usersByRank[rank];
        const rankUserCount = rankUsers.length;
  
        const totalRankAmount = 80; // ₹80 fixed per rank
        const amountPerUser = totalRankAmount / rankUserCount;
  
        console.log(`Rank '${rank}': ${rankUserCount} users, ₹${totalRankAmount} total pool, ₹${amountPerUser.toFixed(2)} each`);
  
        for (const user of rankUsers) {
          const userWallet = await UserWalletRepository.findWalletByUserId(user.userId);
          if (!userWallet) {
            console.log(`⚠️ No wallet found for user ${user.userId}`);
            continue;
          }
  
          const oldBalance = userWallet.balance;
          userWallet.balance += amountPerUser;
          await userWallet.save();
  
          await WalletHistories.create({
            userId: user.userId,
            type: 'credit',
            transactionType: TRANSACTION_TYPE,
            amount: amountPerUser,
            balanceBefore: oldBalance,
            balanceAfter: userWallet.balance,
            source: 'wallet',
            status: 'completed',
            note: `Royalty income for rank ${rank}`,
          });
  
          console.log(`✅ ₹${amountPerUser.toFixed(2)} sent to user ${user.userId} (rank: ${rank})`);
        }
      }
    } catch (err) {
      console.error('[Cron] Royalty Income failed:', err);
    }
  }
  
}  

export default new RoyaltyIncomeCron();
