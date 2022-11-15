import authRouter from '#routes/auth.route'
import commentRouter from '#routes/comment.route'
import postRouter from '#routes/post.route'
import { Router } from 'express'

const routes = Router()

routes.use(authRouter, postRouter, commentRouter)

export default routes
