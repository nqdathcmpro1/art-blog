import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";


export const userRegister = async (req, res) => {
  const { fullName, email, userName, password } = req.body;
  try {
    const existedUser = await User.findOne({ userName });
    if (existedUser)
      return res
        .status(400)
        .json({ message: `User ${userName} already exists.` });
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = await User.create({
      fullName,
      email,
      userName,
      password: hashedPassword,
      avatar: "",
    });

    res
      .status(200)
      .json({ data: newUser, message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


export const getLoginUser = async (req, res) => {
  const { id } = req.query;
  try {
    if (id) {
      const currentUser = await User.findOne({ _id: id });
      res.status(200).json({ data: currentUser });
    } else {
      res.status(200).json({ message: "No user found" });
    }
    return;
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const getAuthorUser = async (req, res) => {
  const { author } = req.params;
  const user = await User.findOne({ userName: author });
  res.status(200).json({ data: user });
};

export const editUser = async (req, res) => {
  const editedUser = req.body;
  const { id } = req.query;

  try {
    if (id) {
      const updatedUser = await User.findByIdAndUpdate(
        id,
        {
          _id: id,
          ...editedUser,
        },
        { new: true }
      );
      res.status(200).json({ data: updatedUser });
    } else {
      res.status(200).json({ message: "No user found" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
