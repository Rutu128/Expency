import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  setMonthlyBudget,
  getCategoryInsights,
  getMonthlyInsights,
} from "../controllers/insights.controller.js";

const router = Router();

router.use(isAuthenticated);
router.post("/budget", setMonthlyBudget);
router.get("/category", getCategoryInsights);
router.get("/monthly", getMonthlyInsights);

export default router;
