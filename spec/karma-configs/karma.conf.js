// Karma configuration
// Generated on Thu Feb 23 2017 01:10:14 GMT-0300 (Pacific SA Summer Time)

const webpackConfig = require('../../webpack.config.js');
delete webpackConfig.entry;

module.exports = function (config) {
    config.set(
      {

          // base path that will be used to resolve all patterns (eg. files, exclude)
          basePath: '../../',


          // frameworks to use
          // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
          frameworks: ['jasmine', 'es6-shim'],


          // list of files / patterns to load in the browser
          files: [
              './spec/**/*.js'
          ],


          // list of files to exclude
          exclude: [],


          // preprocess matching files before serving them to the browser
          // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
          preprocessors: {
              './spec/**/*.js': ['webpack', 'sourcemap']
          },
          babelPreprocessor: {
              options: {
                  presets: ['es2015'],
                  plugins: ["transform-es2015-modules-umd"],
                  sourceMap: 'inline'
              },
          },
          webpack: webpackConfig,

          webpackMiddleware: {
              noInfo: true
          },
          // test results reporter to use
          // possible values: 'dots', 'progress'
          // available reporters: https://npmjs.org/browse/keyword/karma-reporter
          reporters: ['spec', 'coverage'],


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
          browsers: ['Chrome'],
          // browsers: ['PhantomJS'],


          // Continuous Integration mode
          // if true, Karma captures browsers, runs the tests and exits
          singleRun: false,

          // Concurrency level
          // how many browser should be started simultaneous
          concurrency: Infinity
      }
    )
}
