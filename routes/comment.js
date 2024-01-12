const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/comment', commentController.postComment);
router.post('/comment/like/:commentId/:userId', commentController.likeComment);
router.get('/comment/:profileId', commentController.getCommentsByProfileId);

module.exports = function () {
  return router;
};