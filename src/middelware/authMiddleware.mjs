// middlewares/authMiddleware.mjs
import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];  // Extract token from Bearer scheme
  if (!token) {
    return res.status(403).json({ message: 'Access denied. No token provided.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;  // Attach decoded user information to request
    next();
  });
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden. Admins only.' });
  }
  next();
};

export { verifyToken, isAdmin };
