import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import royaltyRoutes from './Routes/royaltyRoutes.mjs';
import permissionRoutes from './Routes/permissionRoutes.mjs';
import rankRoutes from './Routes/RankRoutes.mjs';
import userRoutes from './Routes/UserRoutes.mjs';
// import roleRoutes from './Routes/RoleRoutes.mjs'; 

import incomeLeveleRoutes from './Routes/IncomeLevelRoutes.mjs'
import servicesRoutes from './Routes/ServicesRoutes.mjs';
import RolePermissionRoutes from './Routes/RolePermissionRoutes.mjs'
import RewardsRoutes from './Routes/RewardsRoutes.mjs';
import TypeIncomeRoutes from './Routes/TypeIncomeRoutes.mjs';
import TransactionRoutes from './Routes/TransactionRoutes.mjs';
import RoleRoutes from './Routes/RoleRoutes.mjs';
import WalletRoutes from './Routes/WalletRoutes.mjs';
import BankRoutes from './Routes/BankAccountRoutes.mjs';
import PlanRoutes from './Routes/PlanRoutes.mjs';
import UserPlanRoutes from './Routes/UserPlanRoutes.mjs';
import WithdrawalRoutes from './Routes/WithdrawalRoutes.mjs';
import UserBenefits from './services/UserBenefits.mjs';
import HomeDashboard from './Routes/HomeDashboardRoutes.mjs';
import userModuleRoutes from './Routes/User/userModuleRoutes.mjs'
import LevelIncomeRoutes from './Routes/User/LevelIncomeRoutes.mjs'
import AdminRoutes from './Routes/AdminRoutes.mjs'
import WalletTopupCron from './CronJobs/walletTopupCron.mjs';
import ServiceAPI from './Routes/User/thirdPartyRoute/thirdPartyRoutes.mjs';
import teamSuperPerformanceCron from './CronJobs/teamSuperPerformanceCron.mjs';
import UserBenefitsCron from './CronJobs/UserBenefitsCron.mjs'; 
import RoyaltyIncomeCron from './CronJobs/RoyaltyIncomeCron.mjs';






// Start Cron Jobs
WalletTopupCron.startCron();
teamSuperPerformanceCron.startCron(); // ✅ Don't forget this line!
UserBenefitsCron.startCron(); // ✅ Start the referral reward cron
RoyaltyIncomeCron.startCron();
dotenv.config();

const app = express();
const port = process.env.PORT || 8009;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware
app.use(express.json());
app.use('/Uploads', express.static(path.join(__dirname, '../Uploads')));

// MongoDB connection
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Routes
// User Management Routes
app.use('/api/users', userRoutes);
app.use('/api/roles', RoleRoutes);
app.use('/api/role-permissions', RolePermissionRoutes);
app.use('/api/transactions', TransactionRoutes);
app.use('/api/wallets', WalletRoutes);
app.use('/api/banks', BankRoutes);
app.use('/api/income-levels', incomeLeveleRoutes);
app.use('/api/income-types', TypeIncomeRoutes);
app.use('/api/plans', PlanRoutes);
app.use('/api/user-plans', UserPlanRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/rewards', RewardsRoutes);
app.use('/api/permissions', permissionRoutes);
app.use('/api/ranks', rankRoutes);
app.use('/api/royalties', royaltyRoutes);
app.use('/api/Withdrawal', WithdrawalRoutes);
app.use('/api/homeDashboard', HomeDashboard)
app.use('/api', LevelIncomeRoutes)
app.use('/api', AdminRoutes)

// Start server

//user routes
app.use('/api', userModuleRoutes);

/// third party routes starts ///
app.use('/api', ServiceAPI)
/// third party routes ends ///

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
