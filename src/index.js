import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser'; // Optional, as express.json() might suffice
import userRoutes from './Routes/UserRoutes.mjs';
import royaltyRoutes from './Routes/royaltyRoutes.mjs';
import permissionRoutes from './Routes/permissionRoutes.mjs';
import rankRoutes from './Routes/RankRoutes.mjs';

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
app.use('/api', userRoutes);
app.use('/api', royaltyRoutes);
app.use('/api', permissionRoutes);
app.use('/api', rankRoutes);
// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
