import mongoose, { Schema } from "mongoose";

const budgetSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
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
  },
  {
    timestamps: true,
  }
);


const Budget = mongoose.model("Budget", budgetSchema);

export default Budget;
