import cron from 'node-cron';
import UserModel from './Models/UserModels.mjs';
import Wallet from './Models/WalletModels.mjs';   

let cronJob = null;

// Function to start the cron job
export const startCronJobs = () => {
  console.log('Starting cron job...');
  cronJob = cron.schedule('*/10 * * * * *', async () => {
    try {
      // Log the existing message
      console.log('10 sec completed');

      // Find all users with level: 
      const levelOneUsers = await UserModel.find({ level: 1 }).select('userId');
      
      if (levelOneUsers.length === 0) {
        console.log('No users with level 1 found.');
        return;
        
      }

      // Update wallet balance for each user
      let updatedCount = 0;
      for (const user of levelOneUsers) {
        const result = await Wallet.updateOne(
          { userId: user.userId },
          { $inc: { balance: 1 } }
        );
        if (result.modifiedCount > 0) {
          updatedCount++;
        }
      }

      console.log(`Updated ${updatedCount} wallets for level 1 users.`);
    } catch (err) {
      console.error('Error in cron job:', err.message);
    }
  });
};

// Function to stop the cron job
export const stopCronJobs = () => {
  if (cronJob) {
    console.log('Stopping cron job...');
    cronJob.stop();
    cronJob = null;
  }
};