const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        filename: 'renderfarm.min.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: path.join(__dirname),
        compress: true,
        port: 3000,
    },
};