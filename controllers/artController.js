import moment from "moment";

import Arts from "../models/artModel.js";
import User from "../models/userModel.js";

import { letterFilter } from "../middleware/letterFilter.js";

export const getArts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 12;
    const startIndexPerPage = (Number(page) - 1) * LIMIT; //thứ tự bắt đầu ở mỗi page
    const total = await Arts.countDocuments({});
    const arts = await Arts.find()
      .populate("author")
      .sort({ updatedAt: -1, createdAt: -1, title: 1 })
      .limit(LIMIT)
      .skip(startIndexPerPage);
    return res.status(200).json({
      data: arts,
      currentPage: Number(page),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getArt = async (req, res) => {
  const { id } = req.params;
  try {
    const art = await Arts.findOne({ _id: id }).populate("author");
    if (!art) {
      res.status(404).json({ message: "No such art" });
    }
    res.status(200).json({ data: art });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getManageArts = async (req, res) => {
  /* const currentToken = req.cookies.refreshJWT;
  const decodedToken = jwt.decode(currentToken); */
  const { authorId } = req.query;
  try {
    const manageArts = await Arts.find({
      author: authorId,
    });
    res.status(200).json({
      data: manageArts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getArtsBySearch = async (req, res) => {
  const { search } = req.query;
  try {
    const searchSlug = new RegExp(letterFilter(search).replace(/\s/g, ""), "i");
    const arts = await Arts.find({ searchSlug }).populate("author");

    res.status(200).json({
      data: arts,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const postArt = async (req, res) => {
  const art = req.body;

  const { authorId } = req.query;
  const newArt = new Arts({
    ...art,
    searchSlug: letterFilter(art.title).toLowerCase().replace(/\s/g, ""),
    author: authorId,
  });
  try {
    await newArt.save();
    res.status(200).json({ data: newArt });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const deleteArt = async (req, res) => {
  const { id: _id } = req.params;
  try {
    await Arts.findByIdAndRemove(_id);
    res.status(200).send("Delete successfully");
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const editArt = async (req, res) => {
  const { id: _id } = req.params;
  const editArt = req.body;

  try {
    const updatedPost = await Arts.findByIdAndUpdate(
      _id,
      {
        ...editArt,
        _id,
        searchSlug: letterFilter(editArt.title)
          .toLowerCase()
          .replace(/\s/g, ""),
        updateAt: moment().format("LLLL"),
      },
      { new: true }
    );

    return res.status(200).json({ data: updatedPost });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getArtsByAuthor = async (req, res) => {
  const { author } = req.query;

  try {
    const currentAuthor = await User.findOne({ userName: author });
    const arts = await Arts.find({ author: currentAuthor._id });
    res.status(200).json({ data: arts });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
