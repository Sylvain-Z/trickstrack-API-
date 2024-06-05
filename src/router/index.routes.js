import { Router } from "express";
import users_routes from "./users.routes.js";
import tricks_routes from "./tricks.routes.js";
import videos_routes from "./videos.routes.js";
import comments_routes from "./comments.routes.js";

const router = Router();

router.use("/api/v1/users", users_routes);
router.use("/api/v1/tricks", tricks_routes);
router.use("/api/v1/videos", videos_routes);
router.use("/api/v1/comments", comments_routes);


router.get("*", (req, res) => {
    res.status(404).json({ msg: "not found" });
});

export default router;
