const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true 
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  },
  entry: {
    app: './design'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          // 'style-loader',
          'css-loader', // translates CSS into CommonJS
          'sass-loader' // compiles Sass to CSS, using Node Sass by default
        ]
      }
    ]
  },
  externals: {
  },
  resolve: {
    extensions: ['.ts', '.scss', '.css', '.js'],
    modules: [
      path.resolve(__dirname, "node_modules"),
    ],
  },
  output: {
    filename: `js/[name].[chunkhash].js`,
    path: path.resolve(__dirname, 'hugo/static/design')
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  plugins: [
    new CleanWebpackPlugin(['js', 'css'], {
      root: path.join(__dirname, 'hugo/static/design'),
      beforeEmit: true,
      watch: true,
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash].css',
      chunkFilename: '[id].css'
    }),
    new AssetsPlugin({
      filename: 'webpack_assets.json',
      path: path.join(__dirname, './hugo/data/'),
      prettyPrint: true
    })
  ]
};
