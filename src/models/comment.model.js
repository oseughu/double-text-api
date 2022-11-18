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

commentSchema.plugin(mongooseAutoPopulate)

const Comment = model('Comment', commentSchema)

// function removedLinkedDocuments(doc, next) {
//   Comment.remove({ _id: { $in: doc.replies } })
//   next()
// }

// commentSchema.post('remove', removedLinkedDocuments)

export default Comment
