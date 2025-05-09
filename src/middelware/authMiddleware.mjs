import jwt from 'jsonwebtoken';

const verify = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Debugging: log the entire Authorization header
  console.log("Authorization Header:", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  // Debugging: log the extracted token
  console.log("Extracted Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Debugging: log the decoded token
    console.log("Decoded Token:", decoded);

    req.user = decoded; // Save the decoded token to the request object
    next();
  } catch (error) {
    // Debugging: log the error if token verification fails
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

export default verify;
