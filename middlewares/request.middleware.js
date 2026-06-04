import { logger } from "../logger/index.js";

const requestLogger =
(
  req,
  res,
  next
) => {

  logger.info({

    method:
      req.method,

    url:
      req.originalUrl,

  });

  next();

};

export default requestLogger;