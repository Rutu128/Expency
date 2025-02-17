import { Router } from "express";
import {
  getCategoryStats,
  getDashboardStats,
} from "../controllers/dashboard.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/stats", isAuthenticated, getDashboardStats);
router.get("/category-stats", isAuthenticated, getCategoryStats);

export default router;
