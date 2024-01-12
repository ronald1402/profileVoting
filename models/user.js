const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  name: String,
});

const User = mongoose.model('User', userSchema);

module.exports = User;
