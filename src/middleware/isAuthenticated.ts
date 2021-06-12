import express from 'express';
import { get } from 'lodash';

import { OpenAPIV3 } from 'openapi-types';

import { Operation } from '../operations';

export const checkAuthByType = (
  securityScheme: OpenAPIV3.SecuritySchemeObject,
  req: express.Request
): boolean => {
  switch (securityScheme.type) {
    case 'apiKey':
      if (securityScheme.in === 'header') {
        return req.header(securityScheme.name) === undefined;
      }

      if (securityScheme.in === 'query') {
        return req.query[securityScheme.name] === undefined;
      }

      if (securityScheme.in === 'cookie') {
        return req.cookies[securityScheme.name] === undefined;
      }

      return false;

    case 'http': {
      const authHeader = req.header('Authorization');
      if (!authHeader) {
        return true;
      }

      return securityScheme.scheme === 'basic'
        ? !authHeader.startsWith('Basic')
        : !authHeader.startsWith('Bearer');
    }

    case 'oauth2': {
      const authHeader = req.header('Authorization');
      if (!authHeader) {
        return true;
      }

      return !authHeader.startsWith('Bearer');
    }

    default:
      return false;
  }
};

const isAuthorized = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void | express.Response => {
  if (!res.locals.operation || !(res.locals.operation instanceof Operation)) {
    return next();
  }

  const securityRequirements: OpenAPIV3.SecurityRequirementObject[] =
    res.locals.operation.getSecurityRequirements();
  const { securitySchemes } = res.locals.operation;

  if (
    securityRequirements.some(
      (schemes) =>
        schemes &&
        securitySchemes &&
        Object.keys(schemes).some((scheme) => {
          const securityScheme = get(securitySchemes, scheme);
          return !!securityScheme && checkAuthByType(securityScheme, req);
        })
    )
  ) {
    return res.status(401).json({ message: 'Unauthorized request' });
  }

  return next();
};

export default isAuthorized;
