import express from 'express';
import { match } from 'path-to-regexp';

import { Operation, ParamsSchemas } from '../operations';
import { validator } from '../utils';

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
    const isPathValid = validator.validate(schemas.path, (matchObject && matchObject.params) || {});

    if (!isPathValid) {
      return res.status(400).json({
        message: 'Bad request. Invalid path params.',
        errors: validator.errors,
      });
    }
  }

  return next();
};

export default validatePath;
