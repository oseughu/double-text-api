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

export const upVote = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const post = await Post.findById(id)
  const user = await User.findById(req.user._id)

  if (post.downVotes.includes(user._id)) {
    post.downVotes.pop(user._id)
    post.upVotes.push(user._id)
    post.voteScore++
    await post.save()
    res.status(204).json()
  } else if (!post.upVotes.includes(user._id)) {
    post.upVotes.push(user._id)
    post.voteScore++
    await post.save()
    res.status(204).json()
  } else {
    post.upVotes.pop(user._id)
    post.voteScore--
    await post.save()
    res.status(204).json()
  }
})

export const downVote = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const post = await Post.findById(id)
  const user = await User.findById(req.user._id)

  if (post.upVotes.includes(user._id)) {
    post.upVotes.pop(user._id)
    post.downVotes.push(user._id)
    post.voteScore--
    await post.save()
    res.status(204).json()
  } else if (!post.downVotes.includes(user._id)) {
    post.downVotes.push(user._id)
    post.voteScore--
    await post.save()
    res.status(204).json()
  } else {
    post.downVotes.pop(user._id)
    post.voteScore++
    await post.save()
    res.status(204).json()
  }
})

export const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params

  const post = await Post.findById(id)

  if (req.user._id !== post.author._id) {
    res.status(401)
    throw new Error('Unauthorized.')
  }

  await Post.findOneAndRemove({ _id: id })

  res.status(204).json()
})
