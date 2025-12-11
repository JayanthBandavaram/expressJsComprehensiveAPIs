// Global Error Handling Middleware
const errorHandler = (err, req, res, next) => {
  console.error("ERROR LOG:", err); 


  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    status: statusCode,
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
