import mongoose, { Schema } from "mongoose";

const authSchema = new mongoose.Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
  },
  refreshToken: {
    type: String,
    require: true,
  },
});

const Auth = mongoose.model("Auth", authSchema);

export default Auth;
