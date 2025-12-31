// 404 error middleware
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404); // Set status first
  next(error); // Pass to error handler
};

// Generic error handler middleware
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const message = err.message || "An unexpected error occurred";

  // Handle Mongoose CastError (e.g., invalid ObjectId)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "resource not found";
  }

  // Handle Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = err.message;
  }

  // For other types of known errors, handle them here if needed (e.g., Unique constraint errors)
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate resource found"; // This is a basic example of handling duplicate key error (e.g., MongoDB)
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

export { notFound, errorHandler };
