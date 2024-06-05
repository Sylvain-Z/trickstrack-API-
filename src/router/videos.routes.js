import { Router } from "express";
import { getLastVideo , getVideoByUserID , getVideoByTrickName, addVideo, addReaction} from "../controllers/videos.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/last-upload", getLastVideo);
router.get("/:user_id", auth, getVideoByUserID);
router.get("/trick/:name", getVideoByTrickName);

router.post("/add-video/:user_id", auth, addVideo);
router.post("/react/:user_id/:video_id", auth, addReaction);

export default router;