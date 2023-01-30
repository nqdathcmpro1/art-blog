import jwt from "jsonwebtoken";
import Auth from "../models/authModel.js";

const generateToken = async (userId) => {
  const accessToken = jwt.sign(
    { id: userId },
    `${process.env.ACCESS_TOKEN_SECRET}`,
    {
      expiresIn: "1m",
    }
  );

  const refreshToken = jwt.sign(
    { id: userId },
    `${process.env.REFRESH_TOKEN_SECRET}`,
  );

  const existedUser = await Auth.findOne({ userId })

  if(existedUser) await existedUser.remove()
    
  await Auth.create({
    userId,
    refreshToken: refreshToken,
  });
  return { accessToken, refreshToken };
};

export default generateToken
