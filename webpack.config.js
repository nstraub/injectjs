module.exports = {
    entry: {
        main: './src/main.js'
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
