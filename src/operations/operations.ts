import path from 'path';

import { OpenAPIV3 } from 'openapi-types';

import chokidar from 'chokidar';
import { Request } from 'express';
import SwaggerParser from 'swagger-parser';
import { get, toPairs } from 'lodash';

import { Operation, createOperation } from './operation';

export class Operations {
  operations: Operation[] | null = null;

  file: string;

  locale: string;

  constructor({ file, locale }: { file: string; locale: string }) {
    this.file = file;
    this.locale = locale;
    this.watch();
  }

  reset(): void {
    this.operations = null;
  }

  watch(): void {
    const watcher = chokidar.watch(path.dirname(this.file));

    watcher.on('all', () => this.reset());
  }

  async compile(): Promise<void> {
    const api = await SwaggerParser.dereference(this.file);

    this.operations = toPairs(api.paths as OpenAPIV3.PathsObject).reduce(
      (result: Operation[], [pathName, pathOperations]) => [
        ...result,
        ...this.compileFromPath(pathName, pathOperations, get(api, 'components.securitySchemes')),
      ],
      []
    );
  }

  /* eslint-disable class-methods-use-this */
  compileFromPath(
    pathName: string,
    pathOperations: OpenAPIV3.PathItemObject,
    securitySchemes?: { [key: string]: OpenAPIV3.SecuritySchemeObject }
  ): Operation[] {
    return toPairs(pathOperations).map(([method, operation]) =>
      createOperation({ method, path: pathName, operation, securitySchemes })
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

export const createOperations = ({ file, locale }: { file: string; locale: string }): Operations =>
  new Operations({ file, locale });
