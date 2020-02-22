import express from 'express';
import Ajv from 'ajv';

import { has } from 'lodash';

import { Operation } from '../operations';

const ajv = new Ajv({ coerceTypes: true, unknownFormats: ['int32', 'int64', 'binary'] });

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

  const bodySchema = res.locals.operation.getBodySchema(req.get('content-type'));

  if (Object.keys(req.body).length && !bodySchema) {
    return res.status(400).json({
      message: 'Bad request. Invalid content type.',
    });
  }

  if (bodySchema) {
    const isBodyValid = ajv.validate(bodySchema, req.body);

    if (!isBodyValid) {
      return res.status(400).json({
        message: 'Bad request. Invalid request body.',
        errors: ajv.errors,
      });
    }
  }

  return next();
};

export default validateBody;
