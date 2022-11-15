import mongoose from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'

const { Schema, model } = mongoose

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: true
    },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment', autopopulate: true }]
  },
  { timestamps: true }
)

commentSchema.plugin(mongooseAutoPopulate)

const Comment = model('Comment', commentSchema)

export default Comment
