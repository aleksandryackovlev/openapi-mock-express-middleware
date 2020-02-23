import { handleExamples } from './generator';

describe('generator', () => {
  describe('handleExamples', () => {
    it('should return the first example in the given examples object', () => {
      expect(
        handleExamples({
          first: {
            value: {
              id: 3,
            },
          },
          second: {
            value: {
              id: 7,
            },
          },
        })
      ).toStrictEqual({ id: 3 });
    });

    it('should return an empty string on incorrect examples', () => {
      expect(handleExamples('string')).toBe('');
    });
  });
});
