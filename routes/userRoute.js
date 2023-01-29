import express from "express";

import {
  userRegister,
  getAuthorUser,
  editUser,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/:author", getAuthorUser);

router.post("/register", userRegister);

router.patch("/edit/:id", editUser);

export default router;
