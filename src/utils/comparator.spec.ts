import { expressRouteComparator } from './comparator';

describe('comparator', () => {
  describe('expressRouteComparator', () => {
    it('should desc sort path by a number of segments', () => {
      const initMock: [string, ...unknown[]][] = [
        ['/aaa'],
        ['/aaa/bbb/ccc'],
        ['/aaa/bbb'],
        ['/aaa/ddd/ccc'],
      ];
      const expectedMock: [string, ...unknown[]][] = [
        ['/aaa/bbb/ccc'],
        ['/aaa/ddd/ccc'],
        ['/aaa/bbb'],
        ['/aaa'],
      ];

      expect(initMock.sort(expressRouteComparator)).toEqual(expectedMock);
    });

    it('should desc sort path by params and a number of segments', () => {
      const initMock: [string, ...unknown[]][] = [
        ['/aaa'],
        ['/aaa/{param}/ccc'],
        ['/aaa/{param}'],
        ['/aaa/ddd'],
      ];
      const expectedMock: [string, ...unknown[]][] = [
        ['/aaa/ddd'],
        ['/aaa/{param}/ccc'],
        ['/aaa/{param}'],
        ['/aaa'],
      ];

      expect(initMock.sort(expressRouteComparator)).toEqual(expectedMock);
    });
  });
});
