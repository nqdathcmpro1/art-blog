import Comment from "../models/commentModel.js";
import User from "../models/userModel.js";
import Arts from "../models/artModel.js";

export const getCommentsFromArt = async (req, res) => {
  try {
    const { art } = req.params;
    const commentsFromArt = await Comment.find({ toArtId: art })
      .populate("fromAuthorId")
      .sort({ createdAt: -1 });
    return res.status(200).json({ data: commentsFromArt });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const postComment = async (req, res) => {
  const { fromAuthorId, toArtId, content } = req.body;

  try {
    const newComment = await Comment.create({
      fromAuthorId,
      toArtId,
      content,
    });
    return res.status(200).json({ data: newComment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const editComment = async (req, res) => {
  const { comment } = req.params;
  const editComment = req.body;

  console.log(editComment, comment);
  try {
    const editedComment = await Comment.findByIdAndUpdate(
      {
        _id: comment,
      },
      {
        ...editComment,
      },
      { new: true }
    );
    if (!editedComment) return res.status(404).json({ message: "Not found" });
    return res.status(200).json({ data: editedComment });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  const { comment } = req.params;

  try {
    await Comment.findByIdAndRemove({
      _id: comment,
    });
    return res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
