<div align="center">
  <a href="https://swagger.io/docs/specification/about/">
    <img src="https://raw.githubusercontent.com/aleksandryackovlev/openapi-mock-express-middleware/master/assets/openapi-logo.png" alt="Open API logo" width="200" height="200">
  </a>
  <a href="https://github.com/expressjs/express">
    <img src="https://raw.githubusercontent.com/aleksandryackovlev/openapi-mock-express-middleware/master/assets/express-logo.png" alt="Express logo" width="465" height="141">
  </a>
</div>

[![npm][npm]][npm-url]
[![deps][deps]][deps-url]
[![Build Status](https://travis-ci.org/aleksandryackovlev/openapi-mock-express-middleware.svg?branch=master)](https://travis-ci.org/aleksandryackovlev/openapi-mock-express-middleware)
[![codecov](https://codecov.io/gh/aleksandryackovlev/openapi-mock-express-middleware/branch/master/graph/badge.svg)](https://codecov.io/gh/aleksandryackovlev/openapi-mock-express-middleware)
[![size](https://packagephobia.now.sh/badge?p=openapi-mock-express-middleware)](https://packagephobia.now.sh/result?p=openapi-mock-express-middleware)

# openapi-mock-express-middleware

Generates an express mock server from an [Open API 3.0](https://swagger.io/docs/specification/about/) documentation.

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
  createMockMiddleware({ file: '/absolute/path/to/your/openapi/spec.yml' }),
);

app.listen(80, () => console.log('Server listening on port 80'));
```

### Advanced Config
The middleware uses [json-schmea-faker](https://github.com/json-schema-faker/json-schema-faker) under the hood. To configure it, you can pass locale and the options object to the factory function. (The full list of available options can be seen [here](https://github.com/json-schema-faker/json-schema-faker/tree/master/docs#available-options))

```javascript
const express = require('express');
const { createMockMiddleware } = require('openapi-mock-express-middleware');

const app = express();

app.use(
  '/api',
  createMockMiddleware({
    file: '/absolute/path/to/your/openapi/spec.yml',
    locale: 'ru', // json-schema-faker locale, default to 'en'
    options: { // json-schema-faker options
      alwaysFakeOptionals: true,
      useExamplesValue: true,
      // ...
    },
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

### Faker generated responses
In addition faker functions can be specified for data generation. The list of all available function can be found in the [faker documentation](https://github.com/marak/Faker.js/#api-methods).

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
  id: '8c4a4ed2-efba-4913-9604-19a27f36f322',
  name: 'Mr. Braxton Dickens'.
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

## Contributing

Please take a moment to read our contributing guidelines if you haven't yet done so.

[CONTRIBUTING](./.github/CONTRIBUTING.md)

## License

[MIT](./LICENSE)


[npm]: https://img.shields.io/npm/v/openapi-mock-express-middleware.svg
[npm-url]: https://npmjs.com/package/openapi-mock-express-middleware
[deps]: https://david-dm.org/aleksandryackovlev/openapi-mock-express-middleware.svg
[deps-url]: https://david-dm.org/aleksandryackovlev/openapi-mock-express-middleware
