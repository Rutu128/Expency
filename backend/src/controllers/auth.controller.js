import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(new ApiResponse(400, "Email already exists"));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    let savedUser = await user.save();
    savedUser = savedUser.toObject();
    delete savedUser.password;
    res
      .status(200)
      .json(new ApiResponse(200, savedUser, "User registered successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid email or password"));
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json(new ApiError(400, "Invalid email or password"));
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 604800000,
    };
    res.cookie("token", token, options);
    return res.status(200).json(new ApiResponse(200, {}, "Login successful"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

const logout = (req, res) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    res.clearCookie("token", options);
    res.json(new ApiResponse(200, {}, "Logged out successfully"));
  } catch (error) {
    console.log(error);
    res.status(500).json(new ApiError(500, "Server error", error));
  }
};

const ping = async (req, res) => {
  try {
    const userId = req.user._id;
    let user = await User.findById(userId);
    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found", false));
    }
    user = user.toObject();
    delete user.password;
    res.status(200).json(new ApiResponse(200, user, "User found"));
  } catch {
    res.status(500).json(new ApiError(500, "server error", error.message));
  }
};

export { signUp, login, logout, ping };
