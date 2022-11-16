import User from '#models/user.model'
import bcrypt from 'bcryptjs'
import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body

  const alreadyExists = await User.findOne({ email })

  if (alreadyExists) {
    res.status(400)
    throw new Error('User already exists.')
  }

  const newUser = new User({ name, email, password })

  await newUser.save()

  res.json({ _id: newUser._id, name: newUser.name, email: newUser.email })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    res.status(404)
    throw new Error('User not found.')
  }

  const checkPassword = await bcrypt.compare(password, user.password)

  if (!checkPassword) {
    res.status(400)
    throw new Error('Invalid credentials.')
  }

  const token = jwt.sign({ id: user._id }, process.env.SECRET)

  req.session.jwt = token

  res.send({ message: 'logged in successfully' })
})

export const authUser = asyncHandler(async (req, res) => {
  res.json(req.user)
})

export const logout = (req, res) => {
  req.session.destroy()
  res.send({ message: 'logged out successfully' })
}
