const path = require('path');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');

const BASE_DIR = __dirname;
const DIST_DIR = path.resolve(__dirname, './dist');
const SRC_DIR = path.resolve(__dirname, './demo');
const CORE_DIR = path.resolve(__dirname, './src');

module.exports = {
  entry: {
    'demo': path.resolve(SRC_DIR, './demo')
  },
  resolve: {
    alias: {
      '@': BASE_DIR
    },
    extensions: ['.ts', '.tsx', '.js','.jsx']
  },
  output: {
    path: DIST_DIR,
    filename: '[name].js',
    publicPath: '/'
  },
  mode: process.env.NODE_ENV,
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    allowedHosts: [
      '127.0.0.1'
    ],
    contentBase: '.',
    compress: true,
    port: 9000
  },
  // watch: process.env.NODE_ENV === 'development',
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {
          configFile: path.resolve(__dirname, './tsconfig.test.json')
        },
        include: [
          SRC_DIR,
          CORE_DIR
        ],
        exclude: [
          DIST_DIR
        ]
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    // process.env.NODE_ENV === 'development' && new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      filename: 'demo.html',
      chunks: ['demo'],
      template: path.resolve(SRC_DIR, './demo.html')
    })
  ].filter((plugin) => !!plugin)
}
