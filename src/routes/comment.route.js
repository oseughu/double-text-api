import { addComment, addReply, deleteComment, getComment } from '#controllers/comment.controller'
import checkAuth from '#middleware/checkAuth'
import { Router } from 'express'

const commentRouter = Router()

commentRouter.post('/posts/:id/comments', checkAuth, addComment)
commentRouter.get('/posts/:id/comments/:commentId', getComment)
commentRouter.delete('/posts/:id/comments/:commentId', checkAuth, deleteComment)
commentRouter.post('/posts/:id/comments/:commentId/replies/new', checkAuth, addReply)

export default commentRouter
