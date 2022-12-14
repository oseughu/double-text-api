import Comment from '#models/comment.model'
import Post from '#models/post.model'
import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'

const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }]
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.post('remove', function (doc, next) {
  setTimeout(function () {
    Post.remove({ _id: { $in: doc.posts } })
    next()
  }, 10)
})

userSchema.post('remove', function (doc, next) {
  Comment.remove({ _id: { $in: doc.comments } })
  next()
})

userSchema.plugin(mongooseAutoPopulate)

const User = model('User', userSchema)

export default User
