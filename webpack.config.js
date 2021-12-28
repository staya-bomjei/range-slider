const fs = require('fs');
const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const NAMES = {
  PAGE: 'demo-page',
  PLUGIN: 'range-slider',
};

const PATHS = {
  ROOT: __dirname,
  DIST: path.resolve(__dirname, 'dist'),
  PAGE: path.resolve(__dirname, 'src', NAMES.PAGE),
  PLUGIN: path.resolve(__dirname, 'src', NAMES.PLUGIN),
};

const cssLoaders = [
  MiniCssExtractPlugin.loader,
  'css-loader',
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: [
          [
            'autoprefixer',
          ],
        ],
      },
    },
  },
];

const name = (isDev, ext) => `[name]${(isDev) ? '' : '.[contenthash]'}.${ext}`;

module.exports = (env) => {
  const isDev = Boolean(env.development);
  const baseConfig = {
    mode: (isDev) ? 'development' : 'production',
    entry: {
      [NAMES.PLUGIN]: path.resolve(PATHS.PLUGIN, 'index.ts'),
      [NAMES.PAGE]: path.resolve(PATHS.PAGE, 'index.ts'),
    },
    output: {
      filename: (pathData) => {
        switch (pathData.chunk.name) {
          case NAMES.PLUGIN:
            return `js/${NAMES.PLUGIN}/${name(isDev, 'js')}`;
          default:
            return `js/${name(isDev, 'js')}`;
        }
      },
      path: PATHS.DIST,
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.pug$/,
          loader: '@webdiscus/pug-loader',
          options: {
            pretty: isDev,
          },
        },
        {
          test: /\.css$/,
          use: [...cssLoaders],
        },
        {
          test: /\.s[ac]ss$/,
          use: [...cssLoaders, 'sass-loader'],
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          type: 'asset/resource',
          exclude: /fonts/,
          generator: {
            filename: './assets/img/[contenthash][ext]',
          },
        },
        {
          test: /\.(ttf|woff|svg)$/,
          type: 'asset/resource',
          exclude: /img/,
          generator: {
            filename: './assets/fonts/[name][ext]',
          },
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: (pathData) => {
          switch (pathData.chunk.name) {
            case NAMES.PLUGIN:
              return `js/${NAMES.PLUGIN}/${name(isDev, 'css')}`;
            default:
              return `css/${name(isDev, 'css')}`;
          }
        },
      }),
      new HTMLWebpackPlugin({
        getData: () => {
          try {
            return JSON.parse(fs.readFileSync(`${PATHS.PAGE}/data.json`, 'utf8'));
          } catch (e) {
            return {};
          }
        },
        filename: 'index.html',
        template: path.resolve(PATHS.PAGE, `${NAMES.PAGE}.pug`),
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: path.resolve(PATHS.PAGE, 'assets', 'favicons'),
            to: 'assets/favicons',
          },
        ],
      }),
    ],
  };

  const devConfig = {
    ...baseConfig,
    devServer: {
      port: 4200,
      open: '/index.html',
    },
  };

  const prodConfig = {
    ...baseConfig,
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
  };

  return (isDev) ? devConfig : prodConfig;
};
