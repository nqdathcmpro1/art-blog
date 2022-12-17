import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

export const userLogin = async (req, res) => {
  const { userName, password } = req.body;
  try {
    const existedUser = await User.findOne({ userName });
    if (!existedUser)
      return res
        .status(400)
        .json({ message: `User ${userName} is not exists.` });
    const correctPassword = await bcrypt.compare(
      password,
      existedUser.password
    );

    if (!correctPassword)
      return res.status(400).json({ message: "Your password is incorrect." });
    const accessToken = jwt.sign(
      { id: existedUser._id },
      `${process.env.ACCESS_TOKEN_SECRET}`,
      {
        expiresIn: "10s",
      }
    );

    const refreshToken = jwt.sign(
      { id: existedUser._id },
      `${process.env.REFRESH_TOKEN_SECRET}`,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("refreshJWT", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 24 * 1000,
    });

    res.status(200).json({ data: existedUser, accessToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const refreshTokenUser = (req, res) => {
  const cookieRefreshToken = req.cookies;

  if (!cookieRefreshToken?.refreshJWT)
    res.status(403).json({ message: "Unauthorized" });
  else {
    const refreshToken = cookieRefreshToken.refreshJWT;

    jwt.verify(
      refreshToken,
      `${process.env.REFRESH_TOKEN_SECRET}`,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: "Forbidden" });

        const foundUser = await User.findOne({ _id: decoded.id }).exec();

        if (!foundUser)
          return res.status(403).json({ message: "Unauthorized" });

        const accessToken = jwt.sign(
          { id: foundUser._id },
          `${process.env.ACCESS_TOKEN_SECRET}`,
          { expiresIn: "10s" }
        );

        return res.status(200).json({ data: accessToken });
      }
    );
  }
};

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
      status: "",
    });

    res
      .status(200)
      .json({ data: newUser, message: "User registered successfully" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("refreshJWT", { path: "/", domain: "localhost" }).send();
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
  /* const token = req.cookies.refreshJWT; */
  const editedUser = req.body;
  const { id } = req.query;

  try {
    if (id) {
      /* const decodedToken = await jwt.decode(token); */
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
