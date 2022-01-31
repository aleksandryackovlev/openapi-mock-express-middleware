import jsf, { JSF, JSFOptions } from 'json-schema-faker';

export { JSONSchema, JSFOptions, JSF } from 'json-schema-faker';

export type JSFCallback = (jsfInstance: JSF) => void;

const defaultOptions = {
  optionalsProbability: 0.5,
};

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export const handleExamples = (value: any): any => {
  if (typeof value === 'object' && value !== null && Object.keys(value).length) {
    return value[Object.keys(value)[0]].value;
  }

  return '';
};
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-empty-function */
export const createGenerator: (options?: Partial<JSFOptions>, callback?: JSFCallback) => JSF = (
  options = defaultOptions,
  callback = <JSFCallback>(() => {})
) => {
  jsf.option({
    ...defaultOptions,
    ...options,
  });

  jsf.define('example', (value) => {
    return value;
  });

  jsf.define('examples', handleExamples);

  callback(jsf);

  return jsf;
};
/* eslint-enable @typescript-eslint/no-empty-function */
