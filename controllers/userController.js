const User = require('../models/User');

const createUser = async (req, res, next) => {
  try {
    const user = req.body;

    // Check if username exist
    const existingUser = await User.findOne({ username: user.username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Create a new user
    const createdUser = await User.create(user);

    res.status(201).json(createdUser);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createUser,
};
