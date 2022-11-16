import User from '#models/user.model'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

const checkAuth = asyncHandler(async (req, res, next) => {
  const cookie = req.session.jwt

  if (!cookie || cookie === '') {
    res.status(401).json({ error: 'User not authorized.' })
  }

  const claims = jwt.verify(cookie, process.env.SECRET)

  if (!claims) {
    res.status(401).json({ error: 'User not authorized.' })
  }

  req.user = await User.findById(claims.id)

  next()
})

export default checkAuth
