import express from "express"
import { getCommentsFromArt, postComment , editComment, deleteComment } from "../controllers/commentController.js"

const router = express.Router()

router.get("/get/:art", getCommentsFromArt)

router.post("/", postComment)

router.patch("/:comment", editComment)

router.delete("/:comment", deleteComment)

export default router