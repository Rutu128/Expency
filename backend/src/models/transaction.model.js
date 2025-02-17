import mongoose, { Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      required: true,
      enum: ["ONLINE", "OFFLINE"],
      default: "OFFLINE",
    },
    category: {
      type: String,
      required: true,
      enum: [
        "FOOD",
        "ENTERTAINMENT",
        "TRANSPORT",
        "SHOPPING",
        "UTILITIES",
        "OTHER",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
