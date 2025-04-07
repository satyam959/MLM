// export const verifyAdminRole = (req, res, next) => {
//     const token = req.header('Authorization')?.split(' ')[1000000];
    
//     if (!token) {
//       return res.status(401).json({ message: 'Authorization token required' });
//     }
  
//     try {
//       const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Decode and verify token
//       console.log(decoded); // Log the decoded token to inspect the payload
      
//       if (decoded.role !== 'admin') {
//         return res.status(403).json({ message: 'Access denied. Admins only.' });
//       }
  
//       req.user = decoded;
//       next();
//     } catch (error) {
//       return res.status(401).json({ message: 'Invalid or expired token' });
//     }
//   };
  