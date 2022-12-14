import Comment from '#models/comment.model'
import Post from '#models/post.model'
import User from '#models/user.model'
import asyncHandler from 'express-async-handler'

export const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
  res.json({ posts })
})

export const getPost = asyncHandler(async (req, res) => {
  const { id } = req.params

  const foundPost = await Post.findById(id)

  res.json({ post: foundPost })
})

export const addPost = asyncHandler(async (req, res) => {
  const { title, content } = req.body

  const post = new Post({
    title,
    content,
    author: req.user._id,
    upVotes: [],
    downVotes: [],
    voteScore: 0
  })
  await post.save()

  const foundAuthor = await User.findById(post.author)
  foundAuthor.posts.unshift(post)
  await foundAuthor.save()

  res.status(201).json(post)
})

export const upVote = asyncHandler(async (req, res) => {
  const { id } = req.params
  const post = await Post.findById(id)
  const user = await User.findById(req.user._id)

  if (post.downVotes.includes(user._id)) {
    post.downVotes.pop(user._id)
    post.upVotes.push(user._id)
    post.voteScore++
    await post.save()
    res.sendStatus(204)
  } else if (!post.upVotes.includes(user._id)) {
    post.upVotes.push(user._id)
    post.voteScore++
    await post.save()
    res.sendStatus(204)
  } else {
    post.upVotes.pop(user._id)
    post.voteScore--
    await post.save()
    res.sendStatus(204)
  }
})

export const downVote = asyncHandler(async (req, res) => {
  const { id } = req.params
  const post = await Post.findById(id)
  const user = await User.findById(req.user._id)

  if (post.upVotes.includes(user._id)) {
    post.upVotes.pop(user._id)
    post.downVotes.push(user._id)
    post.voteScore--
    await post.save()
    res.sendStatus(204)
  } else if (!post.downVotes.includes(user._id)) {
    post.downVotes.push(user._id)
    post.voteScore--
    await post.save()
    res.sendStatus(204)
  } else {
    post.downVotes.pop(user._id)
    post.voteScore++
    await post.save()
    res.sendStatus(204)
  }
})

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params

    const post = await Post.findOne({ _id: id })

    if (req.user.email !== post.author.email) {
      res.status(401).json({ message: 'user not authorized.' })
    }

    // const comments = await Comment.find({ _id: post.comments._id })

    // comments.forEach((comment) => {
    //   Comment.findByIdAndDelete(comment._id)
    // })

    await Post.findOneAndRemove({ _id: id })

    res.sendStatus(204)
  } catch (error) {
    res.status(500).json({ message: 'something went wrong.' })
  }
}
