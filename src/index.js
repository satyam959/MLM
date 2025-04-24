import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'; // Optional, as express.json() might suffice
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
import TransactionRoutes from './Routes/TransactionRoutes.mjs'
import RoleRoutes from './Routes/RoleRoutes.mjs'
import WalletRoutes from './Routes/WalletRoutes.mjs'
import BankRoutes from './Routes/BankAccountRoutes.mjs'
import PlanRoutes from './Routes/PlanRoutes.mjs'
import UserPlanRoutes from './Routes/UserPlanRoutes.mjs'

dotenv.config();

const app = express();
const port = process.env.PORT || 8009;

app.use(express.json());

// Connect to MongoDB using the correct MONGO_URL environment variable
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

// Use user routes
app.use('/api', royaltyRoutes);
app.use('/api', permissionRoutes);
app.use('/api', rankRoutes);
app.use('/api',TransactionRoutes);
// Define the routes for user, role, and service management

// Define the routes for user, role, and service management
app.use('/api', userRoutes);    // User routes
app.use('/api', RoleRoutes);    // Role routes
app.use('/api', servicesRoutes); // Service routes (this is where servicesRoutes should be imported)
app.use('/api', incomeLeveleRoutes);
app.use('/api',RolePermissionRoutes)
app.use('/api',RewardsRoutes)
app.use('/api',TypeIncomeRoutes)
app.use('/api',WalletRoutes)
app.use('/api',BankRoutes)
app.use('/api',PlanRoutes)
app.use('/api',UserPlanRoutes)



// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
