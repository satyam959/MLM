// import cron from 'node-cron';
// import WalletModel from '../Models/WalletModels.mjs';

// class WalletTopupCron {
//     constructor() {
//       this.task = null; // Will hold the cron task
//     }
  
//     startCron() {
//       if (this.task) {
//         console.log('Cron already running');
//         return;
//       }
  
//       console.log('✅ Starting Wallet Topup Cron');
  
//       this.task = cron.schedule('* * * * *', async () => {
//         try {
//           console.log(' Cron Running: Adding ₹1 to all wallets...');
//           const incrementValue = 1;
//           const result = await WalletModel.updateMany({}, { $inc: { balance: incrementValue } });
//           console.log(` ${result.modifiedCount} wallets updated by ₹${incrementValue}`);
//         } catch (error) {
//           console.error(' Error in Wallet Topup Cron:', error.message);
//         }
//       });
//     }
  
//     stopCron() {
//       if (this.task) {
//         this.task.stop();
//         this.task = null;
//         console.log('⏸️ Wallet Topup Cron stopped');
//       } else {
//         console.log('Cron is not running');
//       }
//     }
  
//     isRunning() {
//       return this.task !== null;
//     }
//   }
  
//   export default new WalletTopupCron();  






import cron from 'node-cron';
import WalletModel from '../Models/WalletModels.mjs';

class WalletTopupCron {
  constructor() {
    this.task = null;
  }

  startCron() {
    if (this.task) {
      console.log('Cron already running');
      return;
    }

    console.log('✅ Starting Wallet Topup Cron');

    this.task = cron.schedule('* * * * *', async () => {
      try {
        console.log('⏳ Cron Running: ₹1 top-up for eligible wallets...');

        const wallets = await WalletModel.find();

        const now = new Date();

        for (const wallet of wallets) {
          const isSameDay =
            wallet.lastTopupDate &&
            now.toDateString() === wallet.lastTopupDate.toDateString();

          if (!isSameDay) {
            // New day, reset count
            wallet.dailyTopupsCount = 0;
            wallet.lastTopupDate = now;
          }

          if (wallet.dailyTopupsCount < 5) {
            wallet.balance += 1;
            wallet.dailyTopupsCount += 1;
            wallet.lastTopupDate = now;

            await wallet.save();
            console.log(
              `💰 ₹1 added to ${wallet.userId}'s wallet. Total today: ${wallet.dailyTopupsCount}`
            );
          } else {
            console.log(`⛔ ${wallet.userId} already got ₹5 today.`);
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
