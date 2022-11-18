import Comment from '#models/comment.model'
import Post from '#models/post.model'
import asyncHandler from 'express-async-handler'

export const addComment = asyncHandler(async (req, res) => {
  const { content } = req.body
  const { id } = req.params
  const post = await Post.findById(id)

  const comment = new Comment({ content, author: req.user._id, post })
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
  const { id, commentId } = req.params

  const post = await Post.findById(id)
  const comment = await Comment.findById(commentId)

  const reply = new Comment({ content, author: req.user._id, post })
  await reply.save()

  comment.replies.unshift(reply._id)
  await comment.save()
  res.status(201).json({ reply })
})

export const deleteComment = async (req, res, next) => {
  try {
    const { id, commentId } = req.params

    const post = await Post.findById(id)
    const comment = await Comment.findById(commentId)

    if (req.user._id !== comment.author._id && req.user._id !== post.author._id) {
      res.status(401)
      throw new Error('Unauthorized.')
    }

    const replies = await Comment.find({ _id: comment.replies._id })

    replies.forEach((comment) => {
      Comment.findByIdAndDelete(comment._id)
    })

    await Comment.findByIdAndDelete(commentId)

    res.sendStatus(204)

    // Comment.findOneAndRemove({ _id: commentId }, (err, result) => {
    //   if (err) {
    //     console.log(err)
    //   } else {
    //     res.sendStatus(204)
    //   }
    // })
  } catch (error) {
    console.log(error)
  }
}
