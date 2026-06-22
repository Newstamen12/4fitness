const jwt = require('jsonwebtoken');
// CHANGED: Fixed path from '../models/userModel' to '../model/userModel'
const User = require('../model/userModel');

const requireAuth = async (req, res, next) => {
  // Verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  // The header looks like: "Bearer eYjhGciOi..." -> split by space to grab just the token string
  const token = authorization.split(' ')[1];

  try {
    // Verify the token and extract the payload (_id)
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user in the database and attach just their ID to the request object
    req.user = await User.findOne({ _id }).select('_id');

    // Move on to the next middleware or controller function
    next();
  } catch (error) {
    res.status(401).json({ error: 'Request is not authorized' });
  }
};

module.exports = requireAuth;