const path = require('path');
module.exports = {
    resolve: {modules: [path.resolve(__dirname, 'src'), 'node_modules']},
    entry: {
        main: './spec/main.js'
    },
    output: {
        libraryTarget: 'umd',
        filename: 'build/bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader'
            }
        ]

    }
};
