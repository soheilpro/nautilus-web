let webpack = require('webpack');
let failPlugin = require('webpack-fail-plugin');
let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './app/main.tsx',
    vendor: ['react', 'react-dom', 'react-router', 'axios', 'jquery', 'underscore', 'wolfy87-eventemitter', 'blueimp-md5', 'classnames']
  },
  output: {
    path: './out',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
  },
  module: {
    loaders: [
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
      { test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader') },
      { test: /\.ttf(\?\S*)?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.svg(\?\S*)?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.woff2?(\?\S*)?$/, loader: 'file-loader?name=[name].[ext]' },
      { test: /\.eot(\?\S*)?$/, loader: 'file-loader?name=[name].[ext]' }
    ],
    preLoaders: [
      { test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  plugins: [
    failPlugin,
    new ExtractTextPlugin('[name].css'),
    new webpack.optimize.CommonsChunkPlugin('vendor', '[name].js'),
    new HtmlWebpackPlugin({
      template: './app/index.ejs'
    })
  ],
  devtool: 'source-map'
};

if (process.env.NODE_ENV === 'production') {
  module.exports.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );
}
