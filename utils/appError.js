export default class AppError extends Error {
  statusCode;
  status;
  isOperational = true;

  constructor(message, statusCode = 500) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }
}
