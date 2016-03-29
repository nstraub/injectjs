/* globals requirejs: false */

requirejs.config({
    shim: {
        'injectjs': {
            deps: ['lodash'],
            exports: 'injector'
        }
    }
});
