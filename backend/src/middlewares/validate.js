const ApiError = require('../utils/ApiError');

function validate(schema) {
  return (req, res, next) => {
    const payload = {
      body: req.body,
      params: req.params,
      query: req.query,
    };

    const result = schema.safeParse(payload);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));

      return next(new ApiError(400, 'Validation failed', details));
    }

    req.body = result.data.body;
    req.params = result.data.params;
    req.query = result.data.query;

    return next();
  };
}

module.exports = validate;
