import jsf, { JSF, JSFOptions } from 'json-schema-faker';
import faker from 'faker';

export { JSONSchema, JSFOptions, JSF } from 'json-schema-faker';

const defaultOptions = {
  optionalsProbability: 0.5,
};

export const createGenerator: (locale?: string, options?: Partial<JSFOptions>) => JSF = (
  locale = 'en',
  options = defaultOptions
) => {
  jsf.option({
    ...defaultOptions,
    ...options,
  });

  jsf.extend('faker', () => {
    faker.locale = locale;
    return faker;
  });

  jsf.define('example', (value) => {
    return value;
  });

  jsf.define('examples', (value) => {
    if (typeof value === 'object' && value !== null && Object.keys(value).length) {
      return value[Object.keys(value)[0]].value;
    }

    return '';
  });

  return jsf;
};
