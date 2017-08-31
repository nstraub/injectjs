// Karma configuration
// Generated on Thu Feb 23 2017 01:10:14 GMT-0300 (Pacific SA Summer Time)

module.exports = function (config) {
    config.set(
        {

            // base path that will be used to resolve all patterns (eg. files, exclude)
            basePath: '',


            // frameworks to use
            // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
            frameworks: ['jasmine'],


            // list of files / patterns to load in the browser
            files: [
                'spec/main.js'
            ],


            // list of files to exclude
            exclude: [],


            // preprocess matching files before serving them to the browser
            // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
            preprocessors: {
                './spec/main.js': ['webpack']
            },
            webpack: {
                module: {
                    rules: [
                        {
                            test: /\.js$/,
                            loader: 'babel-loader',
                            options: { plugins: [['istanbul', {exclude: ['spec']}]] },
                            enforce: 'post'
                        }
                    ]

                }
            },

            /*webpackMiddleware: {
              noInfo: true
          },*/
            // test results reporter to use
            // possible values: 'dots', 'progress'
            // available reporters: https://npmjs.org/browse/keyword/karma-reporter
            reporters: ['spec', 'coverage'],
            coverageReporter: {

                // reports can be any that are listed here: https://github.com/istanbuljs/istanbul-reports/tree/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib
                reporters: [{type: 'html'}, {type: 'text-summary'}],

                // base output directory. If you include %browser% in the path it will be replaced with the karma browser name

                // if using webpack and pre-loaders, work around webpack breaking the source path
                fixWebpackSourcePaths: true,
            },

            // web server port
            port: 9876,


            // enable / disable colors in the output (reporters and logs)
            colors: true,


            // level of logging
            // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO ||
            // config.LOG_DEBUG
            logLevel: config.LOG_INFO,


            // enable / disable watching file and executing tests whenever any file changes
            autoWatch: true,


            // start these browsers
            // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
            // browsers: ['Chrome'],
            browsers: ['PhantomJS'],


            // Continuous Integration mode
            // if true, Karma captures browsers, runs the tests and exits
            singleRun: false,

            // Concurrency level
            // how many browser should be started simultaneous
            concurrency: Infinity
        }
    );
};
