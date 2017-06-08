const path = require('path');
const webpack = require('webpack');
const failPlugin = require('webpack-fail-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './app/main.ts',
    vendor: ['react', 'react-dom', 'react-router', 'axios', 'underscore', 'wolfy87-eventemitter', 'blueimp-md5', 'classnames', 'uuid', 'jquery', 'jquery-sticky'],
  },
  output: {
    path: path.resolve(__dirname, './out/assets'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { test: /\.less$/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!less-loader' }) },
      { test: /\.ttf(\?\S*)?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.svg(\?\S*)?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.woff2?(\?\S*)?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.eot(\?\S*)?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.html$/, loader: 'html-loader' },
    ],
  },
  plugins: [
    failPlugin,
    new webpack.ProvidePlugin({
      $: "jquery",
    }),
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', filename: '[name].js' }),
    new HtmlWebpackPlugin({
      filename: '../index.ejs',
      template: './app/index.html',
    }),
  ],
  devtool: 'source-map',
};
