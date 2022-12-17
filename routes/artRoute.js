import express from "express";
import {
  getArts,
  getArt,
  getArtsBySearch,
  postArt,
  deleteArt,
  editArt,
  getManageArts,
  getArtsByAuthor,
} from "../controllers/artController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getArts);

router.get("/search", getArtsBySearch);

router.get("/gallery", getArtsByAuthor);

router.get("/manage", getManageArts);

router.get("/:id", getArt);

router.post("/", postArt);

router.delete("/:id", deleteArt);

router.patch("/:id", editArt);

export default router;
