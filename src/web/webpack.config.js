const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');

(module.exports = {
  mode: 'production',
  entry: './App.js',
  output: {
    pathinfo: false,
    filename: 'bundle.js',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: [/node_modules/, '/index.js'],
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
            },
          },
        ],
      },
    ],
  },
}),
  (err, stats) => {
    // [Stats Object](#stats-object)
    if (err || stats.hasErrors()) {
      // [Handle errors here](#error-handling)
    }
    // Done processing
  };
