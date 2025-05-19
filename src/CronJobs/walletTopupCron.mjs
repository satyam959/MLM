import cron from 'node-cron';
import WalletModel from '../Models/WalletModels.mjs';

class WalletTopupCron {
    constructor() {
      this.task = null; // Will hold the cron task
    }
  
    startCron() {
      if (this.task) {
        console.log('Cron already running');
        return;
      }
  
      console.log('✅ Starting Wallet Topup Cron');
  
      this.task = cron.schedule('* * * * *', async () => {
        try {
          console.log('🕒 Cron Running: Adding ₹1 to all wallets...');
          const incrementValue = 1;
          const result = await WalletModel.updateMany({}, { $inc: { balance: incrementValue } });
          console.log(`✅ ${result.modifiedCount} wallets updated by ₹${incrementValue}`);
        } catch (error) {
          console.error('❌ Error in Wallet Topup Cron:', error.message);
        }
      });
    }
  
    stopCron() {
      if (this.task) {
        this.task.stop();
        this.task = null;
        console.log('⏸️ Wallet Topup Cron stopped');
      } else {
        console.log('Cron is not running');
      }
    }
  
    isRunning() {
      return this.task !== null;
    }
  }
  
  export default new WalletTopupCron();  