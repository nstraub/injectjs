/**
 * Created by nico on 17/03/2015.
 */
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
