import cron from 'node-cron';
import WalletModel from '../Models/WalletModels.mjs';
import UserModel from '../Models/UserModels.mjs'; 
class WalletTopupCron {
  constructor() {
    this.task = null;
  }

  startCron() {
    if (this.task) {
      console.log('⏳ Cron already running');
      return;
    }

    console.log('✅ Starting Wallet Topup Cron');

    this.task = cron.schedule('* * * * *', async () => {
      try {
        console.log('🕐 Cron Running: ₹1 top-up for eligible wallets...');

        const wallets = await WalletModel.find();
        const now = new Date();

        for (const wallet of wallets) {
          const user = await UserModel.findOne({ userId: wallet.userId });

          // ✅ Check if user exists and has membership.type === 1
          if (!user || user.membership?.type !== 1) {
            console.log(`🚫 Skipping userId ${wallet.userId} (No membership or type !== 1)`);
            continue;
          }

          const isSameDay =
            wallet.lastTopupDate &&
            now.toDateString() === wallet.lastTopupDate.toDateString();

          // ✅ If new day, reset daily count
          if (!isSameDay) {
            wallet.dailyTopupsCount = 0;
            wallet.lastTopupDate = now;
          }

          // ✅ Only allow 5 top-ups per 24hr
          if (wallet.dailyTopupsCount < 5) {
            wallet.balance += 1;
            wallet.dailyTopupsCount += 1;
            wallet.lastTopupDate = now;

            await wallet.save();

            console.log(
              `💰 ₹1 added to userId ${wallet.userId}. Total today: ₹${wallet.dailyTopupsCount}`
            );
          } else {
            console.log(`⛔ userId ${wallet.userId} already reached ₹5 today.`);
          }
        }
      } catch (error) {
        console.error('❌ Error in Wallet Topup Cron:', error.message);
      }
    });
  }

  stopCron() {
    if (this.task) {
      this.task.stop();
      this.task = null;
      console.log('⏹️ Wallet Topup Cron stopped');
    } else {
      console.log('ℹ️ Cron is not running');
    }
  }

  isRunning() {
    return this.task !== null;
  }
}

export default new WalletTopupCron();
