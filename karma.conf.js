const path = require('path');

module.exports = (config) => {
  config.set({
    basePath: '',
    frameworks: [
      'jasmine',
      'webpack',
    ],
    files: [
      'src/**/*.spec.ts',
    ],
    exclude: [],
    preprocessors: {
      'src/**/*.spec.ts': ['webpack'],
    },
    webpack: {
      mode: 'development',
      output: {
        path: path.resolve(__dirname, 'dist'),
        clean: true,
      },
      resolve: {
        extensions: ['.ts', '.js'],
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
    },
    reporters: ['spec'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: true,
    concurrency: Infinity,
  });
};
