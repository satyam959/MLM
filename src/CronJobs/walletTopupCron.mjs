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

    // ✅ Runs daily at 12 PM
    this.task = cron.schedule('0 12 * * *', async () => {
      try {
        console.log('🕛 Cron Running (12 PM): ₹1 top-up for eligible wallets...');

        const wallets = await WalletModel.find();
        const now = new Date();

        for (const wallet of wallets) {
          const user = await UserModel.findOne({ userId: wallet.userId });

          if (!user || user.membership?.type !== 1) {
            console.log(`🚫 Skipping userId ${wallet.userId} (No membership or type !== 1)`);
            continue;
          }

          // Reset daily count and top-up
          wallet.balance += 1;
          wallet.dailyTopupsCount = 1; // Since it's once per day now
          wallet.lastTopupDate = now;

          await wallet.save();

          console.log(`💰 ₹1 added to userId ${wallet.userId}.`);
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
