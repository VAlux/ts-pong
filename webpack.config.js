const HtmlWebpackPlugin = require('html-webpack-plugin');
const resolve = require('path').resolve;

module.exports = {
  entry: './src/game.ts',
  output: {
    path: resolve('./dist'),
    filename: "bundle.js",
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  devServer: {
    contentBase: './dist'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        exclude: /node_modules/,
        use: [
          {loader: "ts-loader"}
        ]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    })
  ],
}
