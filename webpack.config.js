const path = require('path');

module.exports = {
    entry: './src/index.js',
    mode: 'development',
    output: {
        filename: 'renderfarm.js',
        path: path.resolve(__dirname, 'dist'),
    },
};