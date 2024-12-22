# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [4.3.2](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v4.3.1...v4.3.2) (2024-12-22)


### Features

* **router:** add operations to res locals ([2ddbac0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/2ddbac0d10ed88af9768183a5108b117f3f55bfc))

### [4.3.1](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v4.3.0...v4.3.1) (2024-10-05)

## [4.3.0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v4.2.0...v4.3.0) (2024-10-05)

## [4.2.0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v4.1.2...v4.2.0) (2024-06-25)


### Features

* **generator:** add option for examples randomization in responses ([6bb8a1e](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/6bb8a1e3f207dee9f3c32b3ce198fd698a077e4c)), closes [#52](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/issues/52)

### [4.1.2](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v4.1.1...v4.1.2) (2024-04-24)

### [4.1.1](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v4.1.0...v4.1.1) (2024-03-11)

## [4.1.0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v4.0.1...v4.1.0) (2024-03-11)


### Bug Fixes

* **generator:** do not use example values if the useExampleValues option is set to false ([953af41](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/953af410d18de15969a35146cea56285548836b8))

### [4.0.1](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v3.0.2...v4.0.1) (2022-01-31)


### ⚠ BREAKING CHANGES

* **generator:** The generation of `examples` can be overwritten
* **router:** Error handling must be confgured outside of the middleware.
* **options:** The deprecated `file` option is removed. The `locale` option is removed because
Faker.js is no longer used inside the middleware be default and should be configured separetely.
`jsfCallback` is renamed into `configure`.

### Features

* **generator:** allow to overwrite the behavior for `examples` ([1466fed](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/1466fedd5efd61c1e6404c24c172432b6a8da6f8))


### Bug Fixes

* **operations:** support parameters in the path section ([90cbae6](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/90cbae6371800ebf8256bf22da1f4d725637d078)), closes [#37](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/issues/37)


* **options:** refactor middleware options ([c7fdf85](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/c7fdf85c304ca7066c44154738c530e207edfdbc))
* **router:** remove error handlers from the router ([3af3fc7](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/3af3fc77d88a1c03eed1d32754eb813f786ddfa4))

### [3.0.2](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v3.0.1...v3.0.2) (2021-10-27)

### [3.0.1](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v3.0.0...v3.0.1) (2021-10-24)


### Bug Fixes

* **validator:** set coerceTypes to parse arrays ([e0441d8](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/e0441d8abfa7ffe0d307413d8b96a40add0e1b63))

## [3.0.0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v2.0.2...v3.0.0) (2021-06-13)


### Bug Fixes

* **eslint:** fix typo in is authenticated middleware ([fb06b82](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/fb06b8247ac0f4d9c9b8c1d8d8ffd5f51463b9cd))
* **tsconfig:** temporarily skip lib checks ([84616f8](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/84616f8566b30d04fb0870fc6315987d4be6139c))

### [2.0.2](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v2.0.1...v2.0.2) (2021-03-08)

### [2.0.1](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v2.0.0...v2.0.1) (2021-02-17)


### Bug Fixes

* **headers:** make headers' params case insensitive ([370d621](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/370d62141d92ff05629ebbe11e1fe7eade5ea304))

## [2.0.0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v1.3.0...v2.0.0) (2020-12-26)


### ⚠ BREAKING CHANGES

* **cors:** `cors` option is no longer available

### Bug Fixes

* **validator:** update ajv initialization options according to the new api ([04d64f8](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/04d64f88a2282adba63eb59ab3343259a3c8b7e8))


* **cors:** remove cors handling ([2bc16d0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/2bc16d0ac65e27df80f650a41567619279d3ab81))

## [1.3.0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v1.2.0...v1.3.0) (2020-08-31)


### Features

* **cors:** add preflight cors ([4fec346](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/4fec346660a48e372a7ca8f47ddf5adca4d98ad4))


### Bug Fixes

* **json-schema-faker:** change the order of extension functions in the generator ([a298234](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/a298234371ec0dec2728cb3ef51ded8bde3d7b03))

## [1.2.0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v1.1.0...v1.2.0) (2020-08-28)


### Features

* **generator:** add middleware option for configuring json-schema-faker ([1f74457](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/1f744570925aaf4b52bcb77a4c9fe2ca82a57923))

## [1.1.0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v1.0.0...v1.1.0) (2020-08-10)


### Features

* **router:** add cors options to the router ([d452812](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/d4528126b626171519635058eb44c4321b57eb9d))


### Bug Fixes

* **types:** fix typecasting ([e1c51c9](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/e1c51c95f091500a431527faf5fb39922799e6e4))

## [1.0.0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v0.2.5...v1.0.0) (2020-06-28)


### Bug Fixes

* **index:** remove default export and rename createMiddleware ([91d90d3](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/91d90d348a5337d8f1023a2b12b45ce15e56d2ec))

### [0.2.5](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v0.2.4...v0.2.5) (2020-05-08)

### [0.2.4](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v0.2.3...v0.2.4) (2020-05-03)

### [0.2.3](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v0.2.2...v0.2.3) (2020-03-23)

### [0.2.1](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v0.2.0...v0.2.1) (2020-03-17)

### [0.2.2](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v0.2.0...v0.2.2) (2020-03-23)
### [0.2.1](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v0.2.0...v0.2.1) (2020-03-17)

## [0.2.0](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/compare/v0.1.0...v0.2.0) (2020-02-25)

## 0.1.0 (2020-02-24)


### Features

* **operation:** validate request body ([37da559](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/37da5597e1c9f4f6d4e361211d28449ef9f707b4))
* **operation:** validate request query and headers ([dff5717](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/dff57179760c485696a5032122c78c346fb3b4bc))
* **operation:** validate security schemas on requests ([60d468f](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/60d468f88151515ffd7a4aea51feac67abb4fe0e))
* **operations:** validate request params ([391b38f](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/391b38f3b5b709bc52baada8740155930e3069ab))


### Bug Fixes

* **build:** fix build config ([3304fb8](https://github.com/aleksandryackovlev/openapi-mock-express-middleware/commit/3304fb82e4b27900b0c538c5e40a70b332660a1b))
