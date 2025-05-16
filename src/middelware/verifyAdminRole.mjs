import jwt from 'jsonwebtoken';

class AdminAuth {
    static verifyAdminRole(req, res, next) {
        const authHeader = req.header('Authorization');

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authorization token required' });
        }

        const token = authHeader.split(' ')[1]; // ✅ Correct index

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            console.log('Decoded Token:', decoded); // For debugging

            if (decoded.role !== 'admin') {
                return res.status(403).json({ message: 'Access denied. Admins only.' });
            }

            req.user = decoded; // Attach user info to request
            next(); // Go ahead
        } catch (error) {
            console.error('JWT Verification Error:', error.message);
            return res.status(401).json({ message: 'Invalid or expired token' });
        }
    }
}

export default AdminAuth;
