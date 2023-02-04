import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    fromAuthorId: {
      type: String,
      ref: "User",
    },
    toArtId: {
      type: String,
      ref: "Art",
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment
