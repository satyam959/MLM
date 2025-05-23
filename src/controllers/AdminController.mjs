import User from '../Models/UserModels.mjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


class AdminController {
    // Admin Login with Email & Password
    static async loginWithEmail(req, res) {
        const { email, password } = req.body;
        const secret = process.env.ADMIN_JWT_SECRET;

        console.log('Login Request Body:', req.body);

        try {
            const user = await User.findOne({ email }).lean();

            console.log('User fetched from DB:', user);

            if (!user) {
                return res.status(404).json({
                    message: 'User not found',
                    statusCode: 404
                });
            }

            if (user.role !== 'admin') {
                return res.status(403).json({
                    message: 'Access denied. Admin only.',
                    statusCode: 403
                });
            }

            const dbPassword = user?.password;

            console.log('DB Password:', dbPassword);
            console.log('Entered Password:', password);

            if (password !== dbPassword) {
                return res.status(401).json({
                    message: 'Invalid credentials',
                    statusCode: 401
                });
            }

            // Generate JWT token
            const token = jwt.sign(
                { userId: user.userId, name:user.fullName, role: user.role },
                secret,
                { expiresIn: "365d" }
            );

            return res.status(200).json({
                message: 'Admin logged in successfully',
                statusCode: 200,
                token
            });

        } catch (error) {
            console.error('Login Error:', error);
            return res.status(500).json({
                message: 'Server error',
                statusCode: 500
            });
        }
    }
}

export default AdminController;
