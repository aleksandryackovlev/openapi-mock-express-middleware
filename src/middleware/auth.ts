import express from 'express';

import { OpenAPIV3 } from 'openapi-types';

import { Operation } from '../operations';

const isAuthorized = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): void | express.Response => {
  if (!res.locals.operation || !(res.locals.operation instanceof Operation)) {
    return next();
  }

  const securityRequirements: OpenAPIV3.SecurityRequirementObject[] = res.locals.operation.getSecurityRequirements();

  if (
    securityRequirements.some((schemes) => {
      if (schemes && res.locals.operation.securitySchemes) {
        return Object.keys(schemes).some((scheme) => {
          if (
            res.locals.operation.securitySchemes &&
            res.locals.operation.securitySchemes[scheme]
          ) {
            const securityScheme = res.locals.operation.securitySchemes[scheme];
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
          }

          return false;
        });
      }

      return false;
    })
  ) {
    return res.status(401).json({ message: 'Unauthorized request' });
  }

  return next();
};

export default isAuthorized;
