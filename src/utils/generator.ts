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
export const handleExamples =
  (randomizeExamples: boolean) =>
  (value: any): any => {
    if (typeof value === 'object' && value !== null && Object.keys(value).length) {
      return randomizeExamples
        ? value[Object.keys(value)[Math.floor(Math.random() * Object.keys(value).length)]].value
        : value[Object.keys(value)[0]].value;
    }

    return '';
  };
/* eslint-enable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-empty-function */
export const createGenerator: (
  options?: Partial<JSFOptions & { randomizeExamples: boolean }>,
  callback?: JSFCallback
) => JSF = (options = defaultOptions, callback = <JSFCallback>(() => {})) => {
  const { randomizeExamples, ...jsfOptions } = options;

  const applyedOptions = {
    ...defaultOptions,
    ...jsfOptions,
  };

  const generator = cloneDeep(jsf);
  generator.option(applyedOptions);

  if (applyedOptions.useExamplesValue) {
    /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
    generator.define('example', (value: any) => value);
    generator.define('examples', handleExamples(!!randomizeExamples));
  }

  callback(generator);

  return generator;
};
/* eslint-enable @typescript-eslint/no-empty-function */
