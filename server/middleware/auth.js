const jwt = require('jsonwebtoken');
// const JWT_SECRET = process.env.JWT_SECRET; // This should be uncommented in production
const JWT_SECRET = 'pet_lovers_community_secret_key_2024'; // For development/testing

module.exports = function (req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No authentication token, access denied.' });
  }

  try {
    const tokenWithoutBearer = token.replace('Bearer ', '');
    const decoded = jwt.verify(tokenWithoutBearer, JWT_SECRET);
    req.user = decoded; // Set the entire decoded payload on req.user
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Invalid token, please log in again.' });
  }
}; 