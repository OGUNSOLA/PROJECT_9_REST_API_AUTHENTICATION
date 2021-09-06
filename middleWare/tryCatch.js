/** @format */

function tryCatch(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      if (error) {
        if (
          error.name === "SequelizeUniqueConstraintError" ||
          error.name === "SequelizeValidationError"
        ) {
          const errors = error.errors.map((error) => error.message);
          res.status(400).json({ errors });
        } else {
          throw error;
        }
      }
      // Forward error to the global error handler
      next(error);
    }
  };
}

module.exports = tryCatch;
