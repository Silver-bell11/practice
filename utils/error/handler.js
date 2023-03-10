const message = require('../error/globalErrMsg')

const globalErrorHandler = async (err, req, res, next) => {
  err.statusCode = message[err.message]?.statusCode || 500
  err.message = message[err.message]?.message || err.message
  res.status(err.statusCode).json({ message: err.message })
}

const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch((err) => next(err))
  }
}

module.exports = {
  globalErrorHandler,
  catchAsync,
}
