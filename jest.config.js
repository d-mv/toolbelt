module.exports = {
  displayName: {
    name: 'HOL-LIBRARY-COMMON',
    color: 'cyan',
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['src/__tests__'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
