import express from 'express';
import Ajv from 'ajv';
import { match } from 'path-to-regexp';

import { Operation, ParamsSchemas } from '../operations';

const ajv = new Ajv({ coerceTypes: true, unknownFormats: ['int32', 'int64', 'binary'] });

const validatePath = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void | express.Response => {
  if (!res.locals.operation || !(res.locals.operation instanceof Operation)) {
    return next();
  }

  const schemas: ParamsSchemas = res.locals.operation.getParamsSchemas();

  const matchPath = match(res.locals.operation.pathPattern);
  const matchObject = matchPath(req.path);

  if ((matchObject && matchObject.params) || schemas.path) {
    const isPathValid = ajv.validate(schemas.path, (matchObject && matchObject.params) || {});

    if (!isPathValid) {
      return res.status(400).json({
        message: 'Bad request. Invalid path params.',
        errors: ajv.errors,
      });
    }
  }

  return next();
};

export default validatePath;
