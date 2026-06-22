const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

const requireAdmin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required.' });
  }

  const token = authorization.split(' ')[1];

  try {
    // ✅ FIXED: Changed process.env.SECRET to process.env.JWT_SECRET
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(_id);
    
    if (!user) {
      return res.status(401).json({ error: 'User account no longer exists.' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied. Administrative privileges required.' });
    }

    req.user = user;
    next();

  } catch (error) {
    console.error("Administrative Middleware Validation Failure:", error.message);
    return res.status(401).json({ error: 'Request authentication or verification signature failed.' });
  }
};

module.exports = requireAdmin;