import express from 'express';

import { Operation, ParamsSchemas } from '../operations';
import { validator } from '../utils';

const validateHeaders = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void | express.Response => {
  if (!res.locals.operation || !(res.locals.operation instanceof Operation)) {
    return next();
  }

  const schemas: ParamsSchemas = res.locals.operation.getParamsSchemas();

  if (schemas.header.properties && Object.keys(schemas.header.properties)) {
    const isHeadersValid = validator.validate(schemas.header, req.headers);

    if (!isHeadersValid) {
      return res.status(400).json({
        message: 'Bad request. Invalid headers.',
        errors: validator.errors,
      });
    }
  }

  return next();
};

export default validateHeaders;
