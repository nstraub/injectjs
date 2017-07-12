const webpack = require('webpack');

module.exports = {
    entry: {
        main: './src/main.js'
    },
    output: {
        path: './build',
        libraryTarget: 'umd',
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /src.*\.js$/,
                loader: 'isparta-loader',
                exclude: /node_modules|\.spec\.js$/
            }
        ]

    },
    devtool: 'inline-source-map'
};