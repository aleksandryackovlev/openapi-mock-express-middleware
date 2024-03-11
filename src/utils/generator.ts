import jsf, { JSF, JSFOptions } from 'json-schema-faker';
import { cloneDeep } from 'lodash';

export { JSONSchema, JSFOptions, JSF } from 'json-schema-faker';

export type JSFCallback = (jsfInstance: JSF) => void;

const defaultOptions = {
  optionalsProbability: 0.5,
  useExamplesValue: true,
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
  const applyedOptions = {
    ...defaultOptions,
    ...options,
  };

  const generator = cloneDeep(jsf);
  generator.option(applyedOptions);

  if (applyedOptions.useExamplesValue) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    generator.define('example', (value: any) => value);
    generator.define('examples', handleExamples);
  }

  callback(generator);

  return generator;
};
/* eslint-enable @typescript-eslint/no-empty-function */
