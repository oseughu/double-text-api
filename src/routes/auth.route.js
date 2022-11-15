import { authUser, login, logout, register } from '#controllers/auth.controller'
import checkAuth from '#middleware/checkAuth'
import { Router } from 'express'

const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/user', checkAuth, authUser)
authRouter.post('/logout', checkAuth, logout)

export default authRouter
