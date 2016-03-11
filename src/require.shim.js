/**
 * Created by nico on 17/03/2015.
 */
/* globals requirejs: false */
requirejs.config({
    shim: {
        'lodash': {
            exports: '_'
        },
        'inject': {
            deps: ['lodash'],
            exports: 'injector'
        }
    }
});
