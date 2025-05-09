import jwt from 'jsonwebtoken';

const verify = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.jwt;
    if (!token) throw new MiddlewareError('Token not found in header or cookies');
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decodedToken;
    next();
  } catch (error) {
    console.log("error -- ", error);
    const errorMessage = error instanceof jwt.JsonWebTokenError ? 'Unauthorized or distorted token' : error.message;
    return res.status(401).json({ success: false, message: errorMessage });
  }
};

export default verify;
