import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { login, logout, ping, signUp } from "../controllers/auth.controller.js";

const router = Router();

router.get("/", isAuthenticated, ping);
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", isAuthenticated, logout);

export default router;