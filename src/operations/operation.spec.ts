describe('operation', () => {
  describe('getResponseStatus', () => {
    it('should return the first successful status code', () => {
      expect(true).toBe(false);
    });

    it('should return 200 if successful responses are not described', () => {
      expect(true).toBe(false);
    });

    it('should return 200 if responses are strings', () => {
      expect(true).toBe(false);
    });
  });

  describe('getResponseSchema', () => {
    it('should return the application/json response schema for a given status code', () => {
      expect(true).toBe(false);
    });

    it('should extend the resulting schema with the example prop if it exists on its parent', () => {
      expect(true).toBe(false);
    });

    it('should extend the resulting schema with the examples prop if it exists on its parent', () => {
      expect(true).toBe(false);
    });

    it('should return null if the resulting schema is a reference', () => {
      expect(true).toBe(false);
    });

    it('should return null if schema does not exist', () => {
      expect(true).toBe(false);
    });
  });

  describe('getParamsSchemas', () => {
    it('should return schemas for header, query and path', () => {
      expect(true).toBe(false);
    });
  });

  describe('getBodySchema', () => {
    it('should return the schema for the request body', () => {
      expect(true).toBe(false);
    });
  });
});
