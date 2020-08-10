import express from 'express';
import { OpenAPIV3 } from 'openapi-types';

import { checkAuthByType } from './isAuthenticated';

/* eslint-disable @typescript-eslint/no-unused-vars */
describe('isAuthenticated', () => {
  describe('checkAuthByType', () => {
    it('should authenticate unsuppoted security types', () => {
      const request = {} as express.Request;

      const securityScheme = {
        type: 'openIdConnect',
        openIdConnectUrl: 'http://some-url.com',
      } as OpenAPIV3.SecuritySchemeObject;

      expect(checkAuthByType(securityScheme, request)).toBe(false);
    });

    it('should check auth for the oauth2 security type', () => {
      const securityScheme = {
        type: 'oauth2',
      } as OpenAPIV3.SecuritySchemeObject;

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): string {
            return `Bearer ${name}`;
          },
        } as express.Request)
      ).toBe(false);

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): string {
            return `Bearer ${name}`;
          },
        } as express.Request)
      ).toBe(false);

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): undefined {
            return undefined;
          },
        } as express.Request)
      ).toBe(true);
    });

    it('should check auth for the http basic security type', () => {
      const securityScheme = {
        type: 'http',
        scheme: 'basic',
      } as OpenAPIV3.SecuritySchemeObject;

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): string {
            return `Basic ${name}`;
          },
        } as express.Request)
      ).toBe(false);

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): undefined {
            return undefined;
          },
        } as express.Request)
      ).toBe(true);

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): string {
            return `test ${name}`;
          },
        } as express.Request)
      ).toBe(true);
    });

    it('should check auth for the http bearer security type', () => {
      const securityScheme = {
        type: 'http',
        scheme: 'bearer',
      } as OpenAPIV3.SecuritySchemeObject;

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): string {
            return `Bearer ${name}`;
          },
        } as express.Request)
      ).toBe(false);

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): undefined {
            return undefined;
          },
        } as express.Request)
      ).toBe(true);

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): string {
            return `test ${name}`;
          },
        } as express.Request)
      ).toBe(true);
    });

    it('should check auth for the apiKey security type in headers', () => {
      const securityScheme = {
        type: 'apiKey',
        in: 'header',
        name: 'api-key',
      } as OpenAPIV3.SecuritySchemeObject;

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): string {
            return `${name}`;
          },
        } as express.Request)
      ).toBe(false);

      expect(
        checkAuthByType(securityScheme, {
          header(name: string): undefined {
            return undefined;
          },
        } as express.Request)
      ).toBe(true);
    });

    it('should check auth for the apiKey security type in the query', () => {
      const securityScheme = {
        type: 'apiKey',
        in: 'query',
        name: 'authKey',
      } as OpenAPIV3.SecuritySchemeObject;

      const query: unknown = {
        query: {
          authKey: 'test',
        },
      };

      expect(checkAuthByType(securityScheme, query as express.Request)).toBe(false);

      const wrongQuery: unknown = {
        query: {
          someOtherKey: 'test',
        },
      };

      expect(checkAuthByType(securityScheme, wrongQuery as express.Request)).toBe(true);
    });

    it('should check auth for the apiKey security type in cookies', () => {
      const securityScheme = {
        type: 'apiKey',
        in: 'cookie',
        name: 'authKey',
      } as OpenAPIV3.SecuritySchemeObject;

      expect(
        checkAuthByType(securityScheme, {
          cookies: {
            authKey: 'test',
          },
        } as express.Request)
      ).toBe(false);

      expect(
        checkAuthByType(securityScheme, {
          cookies: {
            someOtherKey: 'test',
          },
        } as express.Request)
      ).toBe(true);
    });

    it('should authorize the apiKey security type of unknown type', () => {
      const securityScheme = {
        type: 'apiKey',
        in: 'unknown',
        name: 'authKey',
      } as OpenAPIV3.SecuritySchemeObject;

      expect(
        checkAuthByType(securityScheme, {
          cookies: {
            authKey: 'test',
          },
        } as express.Request)
      ).toBe(false);

      expect(
        checkAuthByType(securityScheme, {
          cookies: {
            someOtherKey: 'test',
          },
        } as express.Request)
      ).toBe(false);
    });
  });
});
/* eslint-enable @typescript-eslint/no-unused-vars */
