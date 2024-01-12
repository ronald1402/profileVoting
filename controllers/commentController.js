const Comment = require('../models/Comment');
const User = require('../models/User');

const postComment = async (req, res, next) => {
  try {
    const { userId, profileId, title, text } = req.body;
    const comment = new Comment({
      userId,
      profileId,
      title,
      text,
    });
    await comment.save();
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
};

const likeComment = async (req, res, next) => {
  try {
    const { commentId, userId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const updatedComment = await comment.toggleLike(userId);

    res.status(200).json({
    message: updatedComment.likes.includes(userId) ? 'Comment liked successfully' : 'Comment unliked successfully',
    totalLikes: updatedComment.totalLikes,
    });
  } catch (error) {
    next(error);
  }
};

const getCommentsByProfileId = async (req, res, next) => {
  try {
    const { profileId } = req.params;
    let sortCriteria = {};

    const { sortBy } = req.query;
    if (sortBy) {
      if (['totalLikes', 'createdAt'].includes(sortBy)) {
        sortCriteria[sortBy] = sortBy === 'totalLikes' ? -1 : 1;
      } else {
        return res.status(400).json({ message: 'Invalid sortBy parameter' });
      }
    }

    const comments = await Comment.find({ profileId })
    .populate('userId', 'name')
    .sort(sortCriteria)
    .lean();

    const formattedResult = {
    profileId,
    comments: comments.map(comment => ({
      commentId: comment._id,
      userId: comment.userId._id,
      name: comment.userId.name,
      title : comment.title,
      text: comment.text,
      totalLikes: comment.totalLikes,
      createdAt: comment.createdAt,
    })),
    };

    res.status(200).json(formattedResult);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  postComment,
  likeComment,
  getCommentsByProfileId,
};
