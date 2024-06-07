import { Router } from "express";
import { check_token, getAllUsers, userInformations, signin, createAccount, updateUserInfos, updatePassword, deleteUser } from "../controllers/users.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/check_token", auth, check_token);
router.get("/all", auth, getAllUsers);
router.get("/:id", auth, userInformations);

router.post("/signup", createAccount);
router.post("/signin", signin);

router.put("/update/:id", auth, updateUserInfos);
router.put("/update-password/:id", auth, updatePassword);

router.delete("/delete/:id", auth, deleteUser);


export default router;