function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV !== 'test') {
    // eslint-disable-next-line no-console
    console.error('❌ Error:', err);
  }

  return res.status(statusCode).json({
    success: false,
    message,
    details: err.details || null,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = errorHandler;
