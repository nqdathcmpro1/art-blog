import moment from "moment";

import Arts from "../models/artModel.js";
import User from "../models/userModel.js";

import { letterFilter } from "../middleware/letterFilter.js";

export const getArts = async (req, res) => {
  const { page } = req.query;
  try {
    const LIMIT = 10;
    const startNumberPerPage = (Number(page) - 1) * LIMIT;
    const total = await Arts.countDocuments({});
    const numberOfPages = Math.ceil(total / LIMIT);
    const arts = await Arts.find()
      .populate("author")
      .sort({ createdAt: -1, title: 1 })
      .limit(LIMIT)
      .skip(startNumberPerPage);
    if (total === 0) return res.status(500).json({ message: "No art" });

    return res.status(200).json({
      data: arts.map((art) => {
        return {
          _id: art._id,
          title: art.title,
          url: art.url,
        };
      }),
      numberOfPages: numberOfPages,
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
      return res.status(404).json({ message: "No such art" });
    }
    return res.status(200).json({ data: art });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getArtsByAuthor = async (req, res) => {
  const { page } = req.query;
  const { author } = req.params;
  const LIMIT = 10;

  try {
    const currentAuthor = await User.findOne({ userName: author });
    const startNumberPerPage = (Number(page) - 1) * LIMIT;
    const arts = await Arts.find({ author: currentAuthor._id })
      .sort({ updatedAt: -1, createdAt: -1, title: 1 })
      .limit(LIMIT)
      .skip(startNumberPerPage);
    const total = arts.length;
    if (total === 0) return res.status(500).json({ message: "No art" });
    return res.status(200).json({
      data: arts.map((art) => {
        return {
          _id: art._id,
          title: art.title,
          url: art.url,
        };
      }),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getArtsBySearch = async (req, res) => {
  const { search } = req.params;
  const { page } = req.query;
  const LIMIT = 10;
  const startNumberPerPage = (Number(page) - 1) * LIMIT;
  try {
    const searchSlug = new RegExp(letterFilter(search).replace(/\s/g, ""), "i");

    const arts = await Arts.find({ searchSlug })
      .populate("author")
      .sort({ updatedAt: -1, createdAt: -1, title: 1 })
      .limit(LIMIT)
      .skip(startNumberPerPage);

    const total = arts.length;
    if (total === 0) return res.status(500).json({ message: "No art" });
    return res.status(200).json({
      data: arts.map((art) => {
        return {
          _id: art._id,
          title: art.title,
          url: art.url,
        };
      }),
      numberOfPages: Math.ceil(total / LIMIT),
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const postArt = async (req, res) => {
  const art = req.body;

  const newArt = new Arts({
    ...art,
    searchSlug: letterFilter(art.title).toLowerCase().replace(/\s/g, ""),
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
    if (!updatedPost) return res.status(404).json({ message: "Not Found" });
    return res.status(200).json({ data: updatedPost });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
