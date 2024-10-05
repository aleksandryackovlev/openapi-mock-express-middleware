import path from 'path';

import { OpenAPIV3 } from 'openapi-types';

import chokidar from 'chokidar';
import { Request } from 'express';
import SwaggerParser from '@apidevtools/swagger-parser';
import { get, toPairs } from 'lodash';

import { createGenerator, JSFOptions, JSF, JSFCallback } from '../utils';

import { Operation, createOperation } from './operation';

type SecuritySchemes = { [key: string]: OpenAPIV3.SecuritySchemeObject };

export class Operations {
  operations: Operation[] | null = null;

  spec: string | OpenAPIV3.Document;

  generator: JSF;

  constructor({
    spec,
    options,
    callback,
  }: {
    spec: string | OpenAPIV3.Document;
    options: Partial<JSFOptions>;
    callback?: JSFCallback;
  }) {
    this.spec = spec;
    this.watch();
    this.generator = createGenerator(options, callback);
  }

  reset(): void {
    this.operations = null;
  }

  watch(): void {
    if (typeof this.spec !== 'string') return;

    const watcher = chokidar.watch(path.dirname(this.spec));

    watcher.on('all', () => this.reset());
  }

  async compile(): Promise<void> {
    const api = await SwaggerParser.dereference(this.spec);

    this.operations = toPairs(api.paths as OpenAPIV3.PathsObject).reduce(
      (result: Operation[], [pathName, pathOperations]) => [
        ...result,
        ...this.compileFromPath(
          pathName,
          pathOperations as OpenAPIV3.PathItemObject,
          get(api, 'components.securitySchemes') as SecuritySchemes
        ),
      ],
      []
    );
  }

  /* eslint-disable class-methods-use-this */
  compileFromPath(
    pathName: string,
    pathOperations: OpenAPIV3.PathItemObject,
    securitySchemes?: SecuritySchemes
  ): Operation[] {
    const { parameters, ...rest } = pathOperations;
    return toPairs(rest).map(([method, operation]) =>
      createOperation({
        method,
        path: pathName,
        operation: operation as OpenAPIV3.OperationObject,
        securitySchemes,
        generator: this.generator,
        parentParams: parameters,
      })
    );
  }
  /* eslint-enable class-methods-use-this */

  async match(req: Request): Promise<Operation | null> {
    if (!this.operations) {
      await this.compile();
    }

    const { method, path: pathname } = req;

    return (
      (this.operations &&
        this.operations.find(
          ({ method: operationMethod, pathRegexp }) =>
            pathRegexp.exec(pathname) && method.toUpperCase() === operationMethod.toUpperCase()
        )) ||
      null
    );
  }
}

export const createOperations = ({
  spec,
  options,
  callback,
}: {
  spec: string | OpenAPIV3.Document;
  options: Partial<JSFOptions>;
  callback?: JSFCallback;
}): Operations => new Operations({ spec, options, callback });
