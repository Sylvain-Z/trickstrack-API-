import { Router } from "express";
import { check_token, getAllUsers, userInformations, signin, createAccount, updateUserInfos, updatePassword, DeleteUser } from "../controllers/users.js";
import { auth } from "../middlewares/auth.js";

const router = Router();

router.get("/check_token", auth, check_token);
router.get("/all", auth, getAllUsers);
router.get("/:id", auth, userInformations); // composants : Users/MyInfos - Users/UpdateInfos

router.post("/signup", createAccount);
router.post("/signin", signin);

router.put("/update/:id", auth, updateUserInfos); // composant : Users/UpdateInfos
router.put("/update-password/:id", auth, updatePassword); // composant : Users/InfoConnectionUpdate

router.delete("/delete/:id", auth, DeleteUser); // composant : Users/DeleteUser


export default router;