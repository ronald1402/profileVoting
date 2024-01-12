const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  likes: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    },
  ],
  totalLikes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

commentSchema.methods.toggleLike = function (userId) {
    const likedIndex = this.likes.findIndex(like => like.userId.equals(userId));

    if (likedIndex === -1) {
        this.likes.push({ userId });
        this.totalLikes += 1;
    } else {
        this.likes.splice(likedIndex, 1);
        this.totalLikes -= 1;
    }

    return this.save();
};

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
