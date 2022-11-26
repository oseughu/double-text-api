import { authUser, deleteUser, login, logout, register } from '#controllers/auth.controller'
import checkAuth from '#middleware/checkAuth'
import { Router } from 'express'

const authRouter = Router()

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/user', checkAuth, authUser)
authRouter.post('/logout', checkAuth, logout)
authRouter.post('/delete-user', checkAuth, deleteUser)

export default authRouter
