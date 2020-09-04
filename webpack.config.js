const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const APP_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'dist');
const env = process.env.NODE_ENV || 'production';
console.log('env*******************************');
console.log(env);

module.exports = {
  entry: ['babel-polyfill', `${APP_DIR}/app.js`],
  output: {
    path: BUILD_DIR,
    filename: 'bundle.js',
  },
  mode: env,
  devtool: env === 'development' ? 'source-map' : null,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
            },
          },
          'url-loader?limit=10000',
        ],
      },
      { test: /\.(woff|woff2|eot|ttf)$/, loader: 'url-loader?limit=100000' },
    ],
  },
  performance: {
    hints: process.env.NODE_ENV === 'production' ? 'warning' : false,
  },
  plugins: [
    new Dotenv(),
    // new CleanWebpackPlugin([BUILD_DIR]),
    // new CopyWebpackPlugin([{ from: 'public', to: 'public' }]),
    new HtmlWebPackPlugin({
      template: `${APP_DIR}/index.html`,
      filename: './index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'bundle.css',
    }),
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.jsx?$|\.s?css$/,
      minRatio: 0.8,
    }),
  ],
  devServer: {
    contentBase: BUILD_DIR,
    compress: true,
    port: 3000,
    historyApiFallback: true,
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
};

// const path = require('path');
// require('@babel/polyfill');
// const TerserPlugin = require('terser-webpack-plugin');

// // var BrotliPlugin = require('brotli-webpack-plugin')
// var webpack = require('webpack');
// module.exports = {
//   entry: ['@babel/polyfill', './src/app.js'],
//   output: {
//     path: path.join(__dirname, '/public'),
//     filename: 'bundle.js',
//   },
//   plugins: [
//     new webpack.DefinePlugin({
//       // <-- key to reducing React's size
//       'process.env': {
//         NODE_ENV: JSON.stringify('production'),
//       },
//     }),
//     new webpack.optimize.AggressiveMergingPlugin(), //Merge chunks
//   ],
//   optimization: {
//     minimizer: [new TerserPlugin()],
//   },
//   // optimization: {
//   //     minimizer: [
//   //         new TerserPlugin({
//   //             cache: true,
//   //             parallel: true,
//   //             sourceMap: true, // Must be set to true if using source-maps in production
//   //             terserOptions: {
//   //                 // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
//   //             }
//   //         }),
//   //     ],
//   // },
//   node: { fs: 'empty' },
//   module: {
//     rules: [
//       {
//         loader: 'babel-loader',
//         test: /\.js$/,
//         exclude: /node_modules/,
//       },
//       {
//         test: /\.s?css$/,
//         use: ['style-loader', 'css-loader', 'sass-loader'],
//       },
//       {
//         test: /\.(jpe?g|png|gif|mp3)$/i,
//         loaders: ['file-loader'],
//       },
//     ],
//   },
//   devServer: {
//     contentBase: path.join(__dirname, '/public'),
//     historyApiFallback: true,
//   },
// };
