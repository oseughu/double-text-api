import Comment from '#models/comment.model'
import Post from '#models/post.model'
import asyncHandler from 'express-async-handler'

export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body
  const { id } = req.params
  const post = await Post.findById(id)

  const comment = new Comment({ content, author: req.user._id })
  await comment.save()

  post.comments.unshift(comment)
  await post.save()
  res.status(201).json({ comment })
})

export const getComment = asyncHandler(async (req, res) => {
  const { id, commentId } = req.params

  const foundPost = await Post.findById(id)
  const foundComment = await Comment.findById(commentId)

  res.json({ post: foundPost, comment: foundComment })
})

export const addReply = asyncHandler(async (req, res) => {
  const { content } = req.body
  const { commentId, id } = req.params

  const post = await Post.findById(id)
  const comment = await Comment.findById(commentId)

  const reply = new Comment({ content, author: req.user._id })
  await reply.save()

  comment.replies.unshift(reply._id)
  await comment.save()
  res.status(201).json({ reply })
})
