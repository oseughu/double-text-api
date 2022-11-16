import {
  addPost,
  deletePost,
  downVote,
  getPost,
  getPosts,
  upVote
} from '#controllers/post.controller'
import checkAuth from '#middleware/checkAuth'
import { Router } from 'express'

const postRouter = Router()

postRouter.get('/posts', getPosts)
postRouter.get('/posts/:id', getPost)
postRouter.post('/posts/new', checkAuth, addPost)
postRouter.put('/posts/:id/vote-up', checkAuth, upVote)
postRouter.put('/posts/:id/vote-down', checkAuth, downVote)
postRouter.delete('/posts/:id/delete', checkAuth, deletePost)

export default postRouter
