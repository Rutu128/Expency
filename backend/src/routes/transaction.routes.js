import { Router } from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { addTransaction, deleteTransaction, getTransactions, updateTransaction } from "../controllers/transaction.controller.js";

const router = Router();

router.get("/", isAuthenticated, getTransactions);
router.post("/",isAuthenticated,addTransaction)
router.put("/:id",isAuthenticated,updateTransaction)
router.delete("/:id",isAuthenticated,deleteTransaction)

export default router;