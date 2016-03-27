// Karma configuration
// Generated on Thu Mar 05 2015 14:51:57 GMT-0300 (Pacific SA Summer Time)
/* globals module: false */
module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '..',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-coffee-preprocessor',
            'karma-phantomjs-launcher',
            'karma-coverage'
        ],

        // list of files / patterns to load in the browser
        files: [
            'node_modules/lodash/lodash.js',
            'Tests/register.method.js',
            'dist/inject.min.js',
            'Tests/_setup/*.coffee',
            'Tests/**/*.spec.coffee',
            'bower_components/sinonjs/sinon.js',
            'bower_components/jasmine-sinon/lib/jasmine-sinon.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            '*.js': ['coverage'],
            '**/*.coffee': ['coffee']
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress', 'coverage'],

        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },

        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome', 'Firefox', 'PhantomJS'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true
    });
};
