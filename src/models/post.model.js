import Comment from '#models/comment.model'
import mongoose from 'mongoose'
import mongooseAutoPopulate from 'mongoose-autopopulate'

const { Schema, model } = mongoose

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      autopopulate: true
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', autopopulate: true }],
    upVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    downVotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    voteScore: { type: Number }
  },
  {
    timestamps: true
  }
)

postSchema.plugin(mongooseAutoPopulate)

postSchema.post('remove', function (doc) {
  Comment.remove({ _id: { $in: doc.comments } })
})

const Post = model('Post', postSchema)

export default Post
