
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); // Ensure environment variables are loaded

class AdminAuth {
  static verifyAdminRole(req, res, next) {
    try {
      const authHeader = req.headers['authorization'];

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization token required' });
      }

      const token = authHeader.split(' ')[1];

      const secret = process.env.ADMIN_JWT_SECRET;
      if (!secret) {
        console.error('❌ JWT_SECRET is not defined in .env');
        return res.status(500).json({ message: 'Server configuration error' });
      }

      const decoded = jwt.verify(token, secret);
      console.log("decoded",decoded)
      if (!decoded || decoded.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }

      // ✅ Attach decoded user info to req
      req.user = decoded;
      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}

export default AdminAuth;
