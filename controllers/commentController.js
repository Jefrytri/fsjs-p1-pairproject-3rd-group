const { Comment, Post } = require('../models')

class CommentController {
  static async create(req, res, next) {
    try {
      const { postId } = req.params
      const { content } = req.body

      const post = await Post.findByPk(postId)

      if (!post) {
        throw new Error('Post not found')
      }

      await Comment.create({
        content,
        userId: req.session.userId,
        postId
      })

      res.redirect(`/posts/${postId}`)
    } catch (error) {
      next(error)
    }
  }

  static async delete(req, res, next) {
    try {
      const { id } = req.params

      const comment = await Comment.findByPk(id)

      if (!comment) {
        throw new Error('Comment not found')
      }

      const isOwner = comment.userId === req.session.userId
      const isAdmin = req.session.role === 'admin'

      if (!isOwner && !isAdmin) {
        throw new Error('You are not authorized')
      }

      const postId = comment.postId

      await Comment.destroy({
        where: { id }
      })

      res.redirect(`/posts/${postId}`)
    } catch (error) {
      next(error)
    }
  }
}

module.exports = CommentController