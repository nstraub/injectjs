module.exports = {
    entry: {
        main: './src/index.js'
    },
    output: {
        libraryTarget: 'umd',
        filename: 'dist/inject.js'
    },
    resolve: {
        modules: ['src', 'node_modules']
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
