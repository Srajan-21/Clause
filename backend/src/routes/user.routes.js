import { Router } from "express";
import { getUserProfile, loginUser, logoutUser, registerUser } from "../controllers/user.controllers.js";
import { verifyUser } from "../middlewares/auth.middlewares.js";

const router = Router();

router.route("/registerUser").post(registerUser)
router.route("/loginUser").post(loginUser)

// Secured Routes
router.route("/profileUser").get(verifyUser , getUserProfile)
router.route("/logoutUser").get(verifyUser , logoutUser)

export default router