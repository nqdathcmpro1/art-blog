import express from "express";

import {
  userLogin,
  userRegister,
  getAuthorUser,
  editUser,
  refreshTokenUser,
  userLogout,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/login", userLogin);

router.get("/refresh", refreshTokenUser);

router.get("/logout", userLogout);

router.get("/:author", getAuthorUser);

router.post("/register", userRegister);

router.patch("/edit", editUser);

export default router;
