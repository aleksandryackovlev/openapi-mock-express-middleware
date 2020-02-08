import path from 'path';

import { OpenAPIV3 } from 'openapi-types';

import chokidar from 'chokidar';
import { Request } from 'express';
import SwaggerParser from 'swagger-parser';
import { toPairs } from 'lodash';

import Operation from './operation';

class Operations {
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
        ...this.compileFromPath(pathName, pathOperations),
      ],
      []
    );
  }

  /* eslint-disable class-methods-use-this */
  compileFromPath(pathName: string, pathOperations: OpenAPIV3.PathItemObject): Operation[] {
    return toPairs(pathOperations).map(
      ([method, operation]) => new Operation({ method, path: pathName, operation })
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

export default Operations;
