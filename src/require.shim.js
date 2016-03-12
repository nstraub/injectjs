/**
 * Created by nico on 17/03/2015.
 */
/* globals requirejs: false */

requirejs.config({
    shim: {
        'injectjs': {
            deps: ['lodash'],
            exports: 'injector'
        }
    }
});
