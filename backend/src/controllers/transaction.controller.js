import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Transaction from "../models/transaction.model.js";

const addTransaction = async (req, res) => {
  try {
    const userId = req.user._id;
    const { category, amount, date, description, transactionType } = req.body;
    if (!category || !amount || !date || !transactionType || !description) {
      return res.status(400).json(new ApiError(400, "Missing required fields"));
    }
    const transaction = new Transaction({
      userId,
      category,
      amount,
      date,
      description,
      transactionType,
    });
    await transaction.save();
    res
      .status(200)
      .json(
        new ApiResponse(200, transaction, "Transaction added successfully")
      );
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res
      .status(200)
      .json(
        new ApiResponse(200, transactions, "Transactions fetched successfully")
      );
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

const updateTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const { category, amount, date, description, transactionType } = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      {
        _id: transactionId,
        userId: req.user._id,
      },
      {
        category,
        amount,
        date,
        description,
        transactionType,
      },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!transaction) {
      return res.status(404).json(new ApiError(404, "Transaction not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, transaction, "Transaction updated"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const transactionId = req.params.id;
    const transaction = await Transaction.findOneAndDelete({
      _id: transactionId,
      userId: req.user._id,
    });
    if (!transaction) {
      return res.status(404).json(new ApiError(404, "Transaction not found"));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, transaction, "Transaction deleted"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

export {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
};
