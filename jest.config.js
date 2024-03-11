module.exports = {
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.json',
      },
    ],
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/(src|test)/**/*.spec.(ts|js)'],
  testEnvironment: 'node',
};
