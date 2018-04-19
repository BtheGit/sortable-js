const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'sortablejs.js',
    path: path.resolve(__dirname, 'lib'),
    libraryTarget: 'umd',
    library: 'sortablejs',
    umdNamedDefine: true,
    globalObject: 'this'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  }
};