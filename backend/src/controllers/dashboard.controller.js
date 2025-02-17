import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";

const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));

    // Get user's monthly budget
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    // Get total expenses, budget usage, and top category
    const [dashboardStats] = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $facet: {
          // Total expenses in last 30 days
          totalExpenses: [
            {
              $group: {
                _id: null,
                total: { $sum: "$amount" },
              },
            },
          ],
          // Spending by category
          categorySpending: [
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" },
              },
            },
            {
              $sort: { total: -1 },
            },
          ],
          // Monthly total for budget calculation
          monthlyTotal: [
            {
              $group: {
                _id: {
                  year: { $year: "$date" },
                  month: { $month: "$date" },
                },
                total: { $sum: "$amount" },
              },
            },
            {
              $sort: { "_id.year": -1, "_id.month": -1 },
            },
            {
              $limit: 1,
            },
          ],
        },
      },
    ]);

    // Get monthly expenses for the chart
    const monthlyExpenses = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
          },
          amount: { $sum: "$amount" },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
      {
        $project: {
          _id: 0,
          month: {
            $let: {
              vars: {
                monthsInString: [
                  "",
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
              },
              in: {
                $arrayElemAt: ["$$monthsInString", "$_id.month"],
              },
            },
          },
          year: "$_id.year",
          amount: 1,
        },
      },
      {
        $limit: 12,
      },
    ]);

    // Get recent transactions
    const recentTransactions = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
        },
      },
      {
        $sort: { date: -1 },
      },
      {
        $limit: 5,
      },
      {
        $project: {
          description: 1,
          amount: 1,
          category: 1,
          date: 1,
          transactionType: 1,
        },
      },
    ]);

    // Calculate budget usage from user's monthly budget
    const monthlyBudget = user.monthly_budget;
    const currentMonthTotal = dashboardStats.monthlyTotal[0]?.total || 0;
    const budgetUsagePercentage = (currentMonthTotal / monthlyBudget) * 100;

    // Update user's total expense
    await User.findByIdAndUpdate(userId, {
      expense: currentMonthTotal,
    });

    // Format the response
    const response = {
      totalExpenses: dashboardStats.totalExpenses[0]?.total || 0,
      monthlyBudget: {
        total: monthlyBudget,
        used: currentMonthTotal,
        percentage: Math.min(budgetUsagePercentage, 100),
      },
      topCategory: {
        category: dashboardStats.categorySpending[0]?._id || "No Data",
        amount: dashboardStats.categorySpending[0]?.total || 0,
      },
      monthlyExpenses,
      recentTransactions,
    };

    return res
      .status(200)
      .json(
        new ApiResponse(200, response, "Dashboard stats fetched successfully")
      );
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json(new ApiError(500, "Server error", error));
  }
};

const getCategoryStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const { startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    const categoryStats = await Transaction.aggregate([
      {
        $match: {
          userId: userId,
          ...dateFilter,
        },
      },
      {
        $group: {
          _id: "$category",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
          averageAmount: { $avg: "$amount" },
        },
      },
      {
        $sort: { total: -1 },
      },
    ]);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          categoryStats,
          "Category stats fetched successfully"
        )
      );
  } catch (error) {
    console.error("Category stats error:", error);
    return res.status(500).json(new ApiError(500, "Server error", error));
  }
};

export { getDashboardStats, getCategoryStats };