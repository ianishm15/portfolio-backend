import { logger }
from "../logger/index.js";

const errorMiddleware =
(
  err,
  req,
  res,
  next
) => {

  logger.error({

    message:
      err.message,

    stack:
      err.stack,

    url:
      req.originalUrl,

    method:
      req.method,

  });

  return res.status(

    err.statusCode || 500

  ).json({

    success: false,

    message:
      err.message ||

      "Internal Server Error",

  });

};

export default errorMiddleware;