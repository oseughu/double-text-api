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
    post: { type: Schema.Types.ObjectId, ref: 'Post', autopopulate: true },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Comment', autopopulate: true }]
  },
  { timestamps: true }
)

commentSchema.post('remove', function (doc) {
  Comment.remove({ _id: { $in: doc.replies } })
})

commentSchema.plugin(mongooseAutoPopulate)

const Comment = model('Comment', commentSchema)

export default Comment
