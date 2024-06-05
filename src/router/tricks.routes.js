import { Router } from "express";
import { getAllTricks, getAllCategories, getTricksByCategorie, getFlatTricks , getFlatTricksChecked , getGrindAndSlide , getGrabTricks , getGapTricks , getRampTricks } from "../controllers/tricks.js";

const router = Router();

router.get("/all", getAllTricks);
router.get("/categories", getAllCategories);
router.get("/tricksByCategories/:label", getTricksByCategorie);

router.get("/flats", getFlatTricks);
router.get("/grind-slides", getGrindAndSlide);
router.get("/grabs", getGrabTricks);
router.get("/gaps", getGapTricks);
router.get("/ramps", getRampTricks);

router.put("/flat/checked", getFlatTricksChecked);


export default router;