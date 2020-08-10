import express from 'express';
import { has } from 'lodash';

import { Operation } from '../operations';
import { validator } from '../utils';

const validateBody = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void | express.Response => {
  if (
    !res.locals.operation ||
    !(res.locals.operation instanceof Operation) ||
    !has(res.locals.operation.operation, 'requestBody')
  ) {
    return next();
  }

  const bodySchema = res.locals.operation.getBodySchema(
    req.get('content-type') || 'application/json'
  );

  if (Object.keys(req.body).length && !bodySchema) {
    return res.status(400).json({
      message: 'Bad request. Invalid content type.',
    });
  }

  if (bodySchema) {
    const isBodyValid = validator.validate(bodySchema, req.body);

    if (!isBodyValid) {
      return res.status(400).json({
        message: 'Bad request. Invalid request body.',
        errors: validator.errors,
      });
    }
  }

  return next();
};

export default validateBody;
