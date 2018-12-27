const path = require('path');

module.exports = {
  entry: './dist/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'bundle'),
    filename: 'renderfarm.js'
  }
};