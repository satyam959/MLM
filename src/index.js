// import express from 'express';
// import mongoose from 'mongoose';
// import dotenv from 'dotenv';
// import bodyParser from 'body-parser'; // Optional, as express.json() might suffice
// import royaltyRoutes from './Routes/royaltyRoutes.mjs';
// import permissionRoutes from './Routes/permissionRoutes.mjs';
// import rankRoutes from './Routes/RankRoutes.mjs';
// import userRoutes from './Routes/UserRoutes.mjs'; 
// // import roleRoutes from './Routes/RoleRoutes.mjs'; 

// import incomeLeveleRoutes from './Routes/IncomeLevelRoutes.mjs'
// import servicesRoutes from './Routes/ServicesRoutes.mjs'; 
// import RolePermissionRoutes from './Routes/RolePermissionRoutes.mjs'
// import RewardsRoutes from './Routes/RewardsRoutes.mjs';
// import TypeIncomeRoutes from './Routes/TypeIncomeRoutes.mjs';
// import TransactionRoutes from './Routes/TransactionRoutes.mjs'
// import RoleRoutes from './Routes/RoleRoutes.mjs'
// import WalletRoutes from './Routes/WalletRoutes.mjs'
// import BankRoutes from './Routes/BankAccountRoutes.mjs'
// import PlanRoutes from './Routes/PlanRoutes.mjs'
// import UserPlanRoutes from './Routes/UserPlanRoutes.mjs'
// import WithdrawalRoutes from './Routes/WithdrawalRoutes.mjs'
// import UserBenefits from './services/UserBenefits.mjs';
// dotenv.config();

// const app = express();
// const port = process.env.PORT || 8009;

// app.use(express.json());

// // Connect to MongoDB using the correct MONGO_URL environment variable
// mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('Connected to MongoDB');
//     })
//     .catch((error) => {
//         console.error('Error connecting to MongoDB:', error);
//     });

// // // User Management Routes
// // app.use('/api', userRoutes);
// // app.use('/api', RoleRoutes);    
// // app.use('/api', RolePermissionRoutes);

// // // Financial Routes
// // app.use('/api', TransactionRoutes);
// // app.use('/api', WalletRoutes);
// // app.use('/api', BankRoutes);
// // app.use('/api', incomeLeveleRoutes);
// // app.use('/api', TypeIncomeRoutes);

// // // Plan Management Routes
// // app.use('/api', PlanRoutes);

// // // UserPlan Routes
// // app.use('/api', UserPlanRoutes);

// // // Service and Rewards Routes
// // app.use('/api', servicesRoutes);
// // app.use('/api', RewardsRoutes);

// // // Permissions and Ranking
// // app.use('/api', permissionRoutes);
// // app.use('/api', rankRoutes);
// // app.use('/api', royaltyRoutes);
// // User Management Routes
// app.use('/api/users', userRoutes);
// app.use('/api/roles', RoleRoutes);    
// app.use('/api/role-permissions', RolePermissionRoutes);

// // Financial Routes
// app.use('/api/transactions', TransactionRoutes);
// app.use('/api/wallets', WalletRoutes);
// app.use('/api/banks', BankRoutes);
// app.use('/api/income-levels', incomeLeveleRoutes);
// app.use('/api/income-types', TypeIncomeRoutes);

// // Plan Management Routes
// app.use('/api/plans', PlanRoutes);

// // User Plan Routes
// app.use('/api/user-plans', UserPlanRoutes);

// // Service and Rewards Routes
// app.use('/api/services', servicesRoutes);
// app.use('/api/rewards', RewardsRoutes);


// // Permissions and Ranking
// app.use('/api/permissions', permissionRoutes);
// app.use('/api/ranks', rankRoutes);
// app.use('/api/royalties', royaltyRoutes);
// app.use('/api/Withdrawal', WithdrawalRoutes);
// // ✅ This line serves static files from the Uploads folder
// app.use('/Uploads', express.static(path.join(__dirname, 'Uploads')));



// // Start the server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });



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
import incomeLeveleRoutes from './Routes/IncomeLevelRoutes.mjs';
import servicesRoutes from './Routes/ServicesRoutes.mjs';
import RolePermissionRoutes from './Routes/RolePermissionRoutes.mjs';
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
app.use('/api/home-dashboard',HomeDashboard)

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
