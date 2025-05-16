import mongoose from 'mongoose';
import User from '../Models/UserModels.mjs';
import dotenv from 'dotenv';

dotenv.config();

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('MongoDB connected');

        const existingAdmin = await User.findOne({ email: 'admin@example.com' });

        if (existingAdmin) {
            console.log('Admin user already exists');
            return process.exit(0);
        }

        const adminUser = new User({
            fullName: 'Admin User',
            email: 'admin@example.com',
            phone: '9999999999',
            password: 'null', // <<== Plain text password
            dob: new Date('1990-01-01'),
            role: 'admin'
        });

        await adminUser.save();
        console.log('Admin user created successfully');
        process.exit(0);

    } catch (error) {
        console.error('Error seeding admin user:', error);
        process.exit(1);
    }
}

seedAdmin();
