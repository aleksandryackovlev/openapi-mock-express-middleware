import express from 'express';
import Ajv from 'ajv';

import Operation, { ParamsSchemas } from '../operation';

const ajv = new Ajv({ coerceTypes: true, unknownFormats: ['int32', 'int64', 'binary'] });

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
    const isHeadersValid = ajv.validate(schemas.header, req.headers);

    if (!isHeadersValid) {
      return res.status(400).json({
        message: 'Bad request. Invalid headers.',
        errors: ajv.errors,
      });
    }
  }

  return next();
};

export default validateHeaders;
