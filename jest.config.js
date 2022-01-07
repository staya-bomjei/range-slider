module.exports = {
  testEnvironment: 'jsdom',
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/range-slider/**/!(const|types|index).ts',
  ],
};
