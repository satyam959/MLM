import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './Routes/UserRoutes.mjs'; // Correct path for User routes
import roleRoutes from './Routes/RoleRoutes.mjs'; // Correct path for Role routes
import servicesRoutes from './Routes/ServicesRoutes.mjs'; // Correct import for servicesRoutes
import IncomeLeveleRoutes from './Routes/IncomeLevelRoutes.mjs'


dotenv.config();

const app = express();
const port = process.env.PORT || 8009;

// Middleware to parse JSON request bodies
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define the routes for user, role, and service management
app.use('/api', userRoutes);    // User routes
app.use('/api', roleRoutes);    // Role routes
app.use('/api', servicesRoutes); // Service routes (this is where servicesRoutes should be imported)
app.use('/api', IncomeLeveleRoutes);
// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
