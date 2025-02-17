import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import Budget from "../models/budget.model.js";

const setMonthlyBudget = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, amount } = req.body;

    if (!category || !amount || amount < 0) {
      return res.status(400).json(
        new ApiError(400, "Category and valid amount are required")
      );
    }

    // Check if this user already has a budget for this category
    const existingBudget = await Budget.findOne({
      userId,
      category
    });

    if (existingBudget) {
      // Update existing budget
      existingBudget.amount = amount;
      await existingBudget.save();
      return res.status(200).json(
        new ApiResponse(200, existingBudget, "Budget updated successfully")
      );
    } else {
      // Create new budget
      const newBudget = await Budget.create({
        userId,
        category,
        amount
      });
      return res.status(201).json(
        new ApiResponse(201, newBudget, "Budget created successfully")
      );
    }
  } catch (error) {
    console.error("Set monthly budget error:", error);
    return res.status(500).json(new ApiError(500, "Server error", error));
  }
};

const getCategoryInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const { period } = req.query; // Can be 'month' or 'year' or undefined for all time
    
    let dateFilter = {};
    const today = new Date();
    
    if (period === 'month') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      dateFilter = { date: { $gte: startOfMonth, $lte: today } };
    } else if (period === 'year') {
      const startOfYear = new Date(today.getFullYear(), 0, 1);
      dateFilter = { date: { $gte: startOfYear, $lte: today } };
    }

    // Get spending by category
    const categorySpending = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          ...dateFilter
        }
      },
      {
        $group: {
          _id: "$category",
          spent: { $sum: "$amount" }
        }
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          spent: 1
        }
      }
    ]);

    // Get budgets for each category
    const budgets = await Budget.find({ userId });
    const budgetMap = budgets.reduce((acc, budget) => {
      acc[budget.category] = budget.amount;
      return acc;
    }, {});

    // Combine spending with budgets
    const categoryInsights = categorySpending.map(item => ({
      category: item.category,
      spent: item.spent,
      budget: budgetMap[item.category] || 0,
      percentage: budgetMap[item.category] ? 
        Math.min((item.spent / budgetMap[item.category]) * 100, 100) : 0
    }));

    return res
      .status(200)
      .json(
        new ApiResponse(200, categoryInsights, "Category insights fetched successfully")
      );
  } catch (error) {
    console.error("Category insights error:", error);
    return res.status(500).json(new ApiError(500, "Server error", error));
  }
};

const getMonthlyInsights = async (req, res) => {
  try {
    const userId = req.user._id;
    const { year } = req.query;
    
    const yearToUse = year ? parseInt(year) : new Date().getFullYear();
    
    // Get monthly spending data
    const monthlySpending = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: {
            $gte: new Date(yearToUse, 0, 1),
            $lte: new Date(yearToUse, 11, 31, 23, 59, 59)
          }
        }
      },
      {
        $group: {
          _id: { month: { $month: "$date" } },
          spent: { $sum: "$amount" }
        }
      },
      {
        $sort: { "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          spent: 1
        }
      }
    ]);
    
    // Get total annual spending
    const annualTotal = monthlySpending.reduce((total, month) => total + month.spent, 0);
    
    // Get user's monthly budget
    const user = await User.findById(userId);
    const monthlyBudget = user.monthly_budget;
    
    // Format response with month names and add budget info
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const formattedData = monthlySpending.map(item => ({
      month: monthNames[item.month - 1],
      spent: item.spent,
      budget: monthlyBudget,
      percentage: (item.spent / monthlyBudget) * 100
    }));
    
    return res
      .status(200)
      .json(
        new ApiResponse(200, {
          monthlyData: formattedData,
          annualTotal,
          annualBudget: monthlyBudget * 12
        }, "Monthly insights fetched successfully")
      );
  } catch (error) {
    console.error("Monthly insights error:", error);
    return res.status(500).json(new ApiError(500, "Server error", error));
  }
};

export { setMonthlyBudget, getCategoryInsights, getMonthlyInsights };