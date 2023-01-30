import User from "../models/userModel.js";
import Auth from "../models/authModel.js";
import generateToken from "../utils/generateToken.js";

import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";

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

    const { accessToken, refreshToken } = await generateToken(existedUser._id);

    /* res.cookie("refreshJWT", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 60 * 60 * 24 * 1000,
    }); */

    return res.status(200).json({ data: {
      _id: existedUser._id,
      userName: existedUser.userName,
    }, accessToken, refreshToken });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const refreshTokenUser = (req, res) => {
  const { refreshToken } = req.body;
console.log(process.env.REFRESH_TOKEN_SECRET)
  if (!refreshToken) res.status(403).json({ message: "Unauthorized" });
  else {
    jwt.verify(
      refreshToken,
      `${process.env.REFRESH_TOKEN_SECRET}`,
      async (err, decoded) => {
        if (err) return res.status(403).json({ message: err });

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

export const userLogout = async (req, res) => {
  try {
    res.clearCookie("refreshJWT", { path: "/", domain: "localhost" }).send();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
