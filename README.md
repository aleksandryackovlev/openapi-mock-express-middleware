<div align="center">
  <a href="https://swagger.io/docs/specification/about/">
    <img src="https://raw.githubusercontent.com/aleksandryackovlev/openapi-mock-express-middleware/master/assets/openapi-logo.png" alt="Open API logo" width="200" height="200">
  </a>
  <a href="https://github.com/expressjs/express">
    <img src="https://raw.githubusercontent.com/aleksandryackovlev/openapi-mock-express-middleware/master/assets/express-logo.png" alt="Express logo" width="465" height="141">
  </a>
</div>

[![npm][npm]][npm-url]
[![Build Status](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/workflows/build/badge.svg)](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/actions)
[![codecov](https://codecov.io/gh/aleksandryackovlev/openapi-mock-express-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/aleksandryackovlev/openapi-mock-express-middleware)
[![size](https://packagephobia.now.sh/badge?p=openapi-mock-express-middleware)](https://packagephobia.now.sh/result?p=openapi-mock-express-middleware)

# openapi-mock-express-middleware

Generates express mock-servers from [Open API 3.0](https://swagger.io/docs/specification/about/) specs.

## Installation

To begin, you'll need to install `openapi-mock-express-middleware`:

```console
$ npm install openapi-mock-express-middleware --save-dev
```

## Usage
### Simple Config
```javascript
const express = require('express');
const { createMockMiddleware } = require('openapi-mock-express-middleware');

const app = express();

app.use(
  '/api', // root path for the mock server
  createMockMiddleware({ spec: '/absolute/path/to/your/openapi/spec.yml' }),
);

app.listen(80, () => console.log('Server listening on port 80'));
```

### Advanced Config
The middleware uses [json-schmea-faker](https://github.com/json-schema-faker/json-schema-faker) under the hood. To configure it, you can pass the options object to the factory function. (The full list of available options can be seen [here](https://github.com/json-schema-faker/json-schema-faker/tree/master/docs#available-options))

```javascript
const express = require('express');
const { createMockMiddleware } = require('openapi-mock-express-middleware');

const app = express();

app.use(
  '/api',
  createMockMiddleware({
    spec: '/absolute/path/to/your/openapi/spec.yml', // string or OpenAPIV3.Document object
    options: { // json-schema-faker options
      alwaysFakeOptionals: true,
      useExamplesValue: true,
      randomizeExamples: true, // choose a random example from the examples object; when set to false (default) the first example is used
      // ...
    },
    configure: (jsf) => {
    	// function where you can extend json-schema-faker
    	...
    }
  }),
);

app.listen(80, () => console.log('Server listening on port 80'));
```

## Mock data
### Basic behavior
By default midleware generates random responses depending on the types specified in the openapi docs.

**doc.yml**
```
...
paths:
  /company
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                required:
                  - id
                  - number
                properties:
                  id:
                    type: string
                  number:
                type: integer
...
```

**GET /company response**
```javascript
{
  id: 'dolor veniam consequat laborum',
  number: 68385409.
}
```

### Faker or Chance generated responses
In addition `faker.js` or `chance.js` methods can be specified for data generation. In order to use these generators you have to configure middleware through the `configure` option of the factory function.

```javascript
const express = require('express');
const { createMockMiddleware } = require('openapi-mock-express-middleware');
import faker from '@faker-js/faker';
import Chance from 'chance';

const app = express();

app.use(
  '/api',
  createMockMiddleware({
    spec: '/absolute/path/to/your/openapi/spec.yml',
    configure: (jsf) => {
    	jsf.extend('faker', () => faker);
	jsf.extend('chance', () => new Chance());
    }
  }),
);

app.listen(80, () => console.log('Server listening on port 80'));

```

After that you can use 'x-faker' and/or 'x-chance' attributes in your openapi specs.

**spec.yml**
```
...
paths:
  /user
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                required:
                  - id
                  - name
                properties:
                  id:
                    type: string
                    x-faker: random.uuid
                  name:
                    type: string
                    x-faker: name.findName
                  email:
                    type: string
                    x-chance:
                      email:
                        domain: fake.com	  
...
```

**GET /user response**
```javascript
{
  id: '8c4a4ed2-efba-4913-9604-19a27f36f322',
  name: 'Mr. Braxton Dickens',
  email: 'giigjom@fake.com'
}
```

### Responses generated from examples
If an example for the response object is specified, it will be used as a resulting sever response.

**doc.yml**
```
...
paths:
  /user
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                example:
                  id: 'id-125'
                  name: 'John Smith'
                required:
                  - id
                  - name
                properties:
                  id:
                    type: string
                    x-faker: random.uuid
                  name:
                    type: string
                    x-faker: name.findName
...
```

**GET /user response**
```javascript
{
  id: 'id-125',
  name: 'John Smith'.
}
```

If multiple examples for the response object are specified, the first one will be used as a resulting sever response.

**doc.yml**
```
...
paths:
  /user
    get:
      responses:
        '200':
          content:
            application/json:
              schema:
                type: object
                examples:
                  first:
                    value:
                      id: 'id-125'
                      name: 'John Smith'
                  second:
                    value:
                      id: 'some-other-id'
                      name: 'Joe Doe'
                required:
                  - id
                  - name
                properties:
                  id:
                    type: string
                    x-faker: random.uuid
                  name:
                    type: string
                    x-faker: name.findName
...
```

**GET /user response**
```javascript
{
  id: 'id-125',
  name: 'John Smith'.
}
```

If you want to use some other logic for generating responses from the `examples` attributes you can easily implement it by overwriting this behavior in the `configure` option of the middleware's factory function:

```javascript
const express = require('express');
const { createMockMiddleware } = require('openapi-mock-express-middleware');

const app = express();

app.use(
  '/api',
  createMockMiddleware({
    spec: '/absolute/path/to/your/openapi/spec.yml',
    configure: (jsf) => {
      jsf.define('examples', (value) => {
        if (typeof value === 'object' && value !== null && Object.keys(value).length) {
          return value[Object.keys(value)[0]].value;
        }

        return '';
      });
    }
  }),
);

app.listen(80, () => console.log('Server listening on port 80'));

```

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)


[npm]: https://img.shields.io/npm/v/openapi-mock-express-middleware.svg
[npm-url]: https://npmjs.com/package/openapi-mock-express-middleware
