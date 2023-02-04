import mongoose from "mongoose";

const artsSchema = new mongoose.Schema(
  {
    title: String,
    url: String,
    author: {
      type: String,
      ref: "User",
    },
    searchSlug: String,
  },
  {
    timestamps: true,
  }
);

const Arts = mongoose.model("Art", artsSchema);

export default Arts;
