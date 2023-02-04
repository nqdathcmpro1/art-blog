import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";

import artRoute from "./routes/artRoute.js";
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import commentRoute from "./routes/commentRoute.js";

const app = express();

dotenv.config();
const PORT = process.env.PORT || 5000;

app.set("trust proxy", 1);

mongoose
  .set("strictQuery", true)
  .connect(process.env.CONNECTION_URL)
  .then(
    app.listen(PORT, () => {
      console.log(`listening on port ${PORT}`);
    })
  )
  .catch((err) => console.log("err", err));

app.use(morgan("combined"));
app.use(bodyParser.urlencoded({ extended: true, limit: "30mb" }));
app.use(bodyParser.json({ extended: true, limit: "30mb" }));
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(cookieParser());

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.use("/art", artRoute);
app.use("/user", userRoute);
app.use("/auth", authRoute);
app.use("/comment", commentRoute)