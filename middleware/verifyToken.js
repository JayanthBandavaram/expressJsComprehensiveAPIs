import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";

export const verifyToken = (req, res, next) => {
  let token;

  // Accept 'Authorization: Bearer <token>'
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  // If token missing
  if (!token) {
    return next(new AppError("Unauthorized: No token provided", 401));
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(new AppError("Invalid or expired token", 401));
    }

    req.user = decoded; // add userId to request
    next();
  });
};
