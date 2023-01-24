import express from "express";
import {
  getArts,
  getArt,
  getArtsBySearch,
  postArt,
  deleteArt,
  editArt,
  getArtsByAuthor,
} from "../controllers/artController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/* router.use(authMiddleware) */

router.get("/", getArts);

router.get("/search/:search", getArtsBySearch);

router.get("/author/:author", getArtsByAuthor);

router.get("/:id", getArt);

router.post("/", postArt);

router.delete("/:id", deleteArt);

router.patch("/:id", editArt);

export default router;
