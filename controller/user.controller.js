import User from "../model/user.Model.js";
import bcrypt from "bcryptjs";
import { getCache, setCache } from "../utils/cache.js";
import AppError from "../utils/appError.js";
import jwt from "jsonwebtoken";


   //Create User

export const create = async (req, res, next) => {
  try {
    const { name, email, phone, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return next(new AppError("User already exists", 400));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      phone,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser,
    });
  } catch (err) {
    next(err);
  }
};


export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return next(new AppError("Email and password are required", 400));
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError("Invalid email or password", 401)); // Unauthorized
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError("Invalid email or password", 401));
    }

    // 4. Generate token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // 5. Send Response
    res.status(200).json({
      status: "success",
      message: "Login successful",
      token,
    });

  } catch (error) {
    next(error);
  }
};




   ///Get All Users (with cache)

export const getAllUsers = async (req, res, next) => {
  try {
    const cachedData = getCache("all_users");

    if (cachedData) {
      return res.status(200).json({
        success: true,
        fromCache: true,
        data: cachedData,
      });
    }

    const users = await User.find({}, "name email phone");

    if (!users || users.length === 0) {
      return next(new AppError("No users found", 404));
    }

    setCache("all_users", users);

    res.status(200).json({
      success: true,
      fromCache: false,
      count: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};


   //Get User By ID

export const fetchById = async (req, res, next) => {
  try {
    const id = req.params.id;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};


   //Fetch All Users (without cache)

export const fetch = async (req, res, next) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (err) {
    next(err);
  }
};


   //Update User

export const update = async (req, res, next) => {
  try {
    const id = req.params.id;

    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updatedUser) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};


   //Delete User

export const deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
