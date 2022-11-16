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

  res.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Credentials', true)

  res.cookie('jwt', token, {
    httpOnly: true,
    signed: true,
    sameSite: false,
    secure: true,
    maxAge: 24 * 60 * 60 * 100
  })

  res.json({ token })
})

export const authUser = asyncHandler(async (req, res) => {
  res.json(req.user)
})

export const logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 0, sameSite: false })
  res.json('successfully logged out.')
}
