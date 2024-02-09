const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  let errorMessage;

  if (err.name === 'ValidationError') {
    errorMessage = Object.values(err.errors).map(singleErr => singleErr.message).join(',');
    err.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.code && err.code === 11000) {
    errorMessage = `This ${Object.keys(err.keyValue)} already exists in records`;
    err.statusCode = StatusCodes.BAD_REQUEST;
  }

  if (err.name === 'CastError') {
    errorMessage = `No item found with ${err.value}`;
    err.statusCode = StatusCodes.NOT_FOUND;
  }

  const finalErrorMessage = errorMessage || err.message || 'Something went wrong';
  const finalErrorCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;

  res.status(finalErrorCode).json({ message: finalErrorMessage });

  console.log(err);
};

module.exports = errorHandlerMiddleware;