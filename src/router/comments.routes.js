import { Router } from "express";
import { getAllComments, getVideoLastComment, getVideoAllComments, addComment } from "../controllers/comments.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/all-comments", getAllComments);
router.get("/last-comment/:video_id", getVideoLastComment);
router.get("/all-comments/:video_id", getVideoAllComments);

router.post("/add-comment", auth, addComment);

export default router;