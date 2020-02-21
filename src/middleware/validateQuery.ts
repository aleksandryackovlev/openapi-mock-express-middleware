import express from 'express';
import Ajv from 'ajv';

import { Operation, ParamsSchemas } from '../operations';

const ajv = new Ajv({ coerceTypes: true, unknownFormats: ['int32', 'int64', 'binary'] });

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
    const isQueryValid = ajv.validate(schemas.query, req.query);

    if (!isQueryValid) {
      return res.status(400).json({
        message: 'Bad request. Invalid query string.',
        errors: ajv.errors,
      });
    }
  }

  return next();
};

export default validateQuery;
