module.exports = {
  modulePathIgnorePatterns: ['<rootDir>/node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/src/range-slider/**/!(default|const|index).ts',
  ],
};
