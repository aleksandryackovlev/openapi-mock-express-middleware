const isPathParam = (segment: string) => segment.startsWith('{') && segment.endsWith('}');

// eslint-disable-next-line import/prefer-default-export
export function expressRouteComparator(
  pathA: [string, ...unknown[]],
  pathB: [string, ...unknown[]]
) {
  const segmentsA = pathA[0].split('/');
  const segmentsB = pathB[0].split('/');

  for (let i = 0; i < Math.min(segmentsA.length, segmentsB.length); i += 1) {
    const isParamA = isPathParam(segmentsA[i]);
    const isParamB = isPathParam(segmentsB[i]);

    if (isParamA && !isParamB) return 1;
    if (!isParamA && isParamB) return -1;
  }

  return segmentsB.length - segmentsA.length;
}
