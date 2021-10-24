import Ajv from 'ajv';

const ajv = new Ajv({
  strict: false,
  coerceTypes: 'array',
  formats: {
    int32: true,
    int64: true,
    binary: true,
  },
});

export default ajv;
