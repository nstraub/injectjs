module.exports = {
    entry: {
        main: './src/main.js'
    },
    output: {
        libraryTarget: 'umd',
        filename: 'build/bundle.js'
    },
    resolve: {
        modules: ['src', 'node_modules'],
        alias: {
            sinon: 'sinon/pkg/sinon'
        }
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
