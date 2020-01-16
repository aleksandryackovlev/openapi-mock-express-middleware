import express from 'express';
import methodOverride from 'method-override';

export interface Options {
  file: string;
  locale?: string;
}

export interface Operation {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'OPTIONS' | 'HEAD' | 'PATCH';
  pathPattern: string;
  pathRegexp: RegExp;
}

const createMiddleware = ({ file, locale = 'en' }: Options): express.Router => {
  const router = express.Router();

  const operations: Operation[] = [];
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());
  router.use(methodOverride());

  router.use('/{0,}', (req, res, next) => {
    const resultOperation: Operation | undefined = operations.find(
      ({ method: operationMethod, pathRegexp }) =>
        pathRegexp.exec(req.path) && req.method === operationMethod
    );

    return resultOperation
      ? res.json({ file, locale, pattern: resultOperation.pathPattern })
      : next();
  });

  router.use((req, res) => {
    res.status(404).send("Sorry can't find that!");
  });

  router.use((err: Error, req: express.Request, res: express.Response): void => {
    // if (err && err.stack) {
    //   console.error(err.stack);
    // }

    res.status(500).send('Something broke!');
  });

  return router;
};

// const app = express();
// const port = 3000;

// app.use('/api', createMiddleware({ file: 'test' }));

// app.listen(port, () => console.log(`App is running on port ${port}`));

export default createMiddleware;
