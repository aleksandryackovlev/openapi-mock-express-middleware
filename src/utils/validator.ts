import Ajv from 'ajv';

const ajv = new Ajv({ coerceTypes: true, unknownFormats: ['int32', 'int64', 'binary'] });

export default ajv;
