import { addComment, addReply, getComment } from '#controllers/comment.controller'
import checkAuth from '#middleware/checkAuth'
import { Router } from 'express'

const commentRouter = Router()

commentRouter.post('/posts/:id/comments', checkAuth, addComment)
commentRouter.get('/posts/:id/comments/:commentId/', getComment)
commentRouter.post('/posts/:id/comments/:commentId/replies/new', checkAuth, addReply)

export default commentRouter
