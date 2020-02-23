import express from 'express';

import { Operation, ParamsSchemas } from '../operations';
import { validator } from '../utils';

const validateQuery = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void | express.Response => {
  if (!res.locals.operation || !(res.locals.operation instanceof Operation)) {
    return next();
  }

  const schemas: ParamsSchemas = res.locals.operation.getParamsSchemas();

  if (
    (schemas.query.properties && Object.keys(schemas.query.properties)) ||
    (req.query && Object.keys(req.query))
  ) {
    const isQueryValid = validator.validate(schemas.query, req.query);

    if (!isQueryValid) {
      return res.status(400).json({
        message: 'Bad request. Invalid query string.',
        errors: validator.errors,
      });
    }
  }

  return next();
};

export default validateQuery;
