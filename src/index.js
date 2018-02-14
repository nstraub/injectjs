import {registerType, registerFake, registerProvider, registerMain} from 'registration';
import {getDescriptor}                                              from './injection';
import {buildProvider}                                              from './providers';
import {clearState}                                                 from './util';


export function createInjector() {
    const curry = function (fn) {
        return function (arg1) {
            return function (...args) {
                return fn(arg1, ...args);
            };
        };
    };
    const stores = {
        types: {},
        providers: {},
        fakes: {},
        state: {},
        cache: {},
        DEFAULT_LIFETIME: 'transient'
    };
    const build = curry(buildProvider)(stores);
    const descriptor = curry(getDescriptor)(stores);

    const registration = {
        registerType: curry(registerType)(stores),
        registerFake: curry(registerFake)(stores),
        registerProvider: curry(registerProvider)(stores),
        registerMain: curry(registerMain)(stores)
    };

    const injection = {

        inject: function (name) {
            return build(descriptor(name));
        },

        get: function (name, adhoc_dependencies, context) {
            if (name.indexOf('::provider') > -1) {
                name = name.split('::provider')[0];
                const spec = injection.inject(name);
                return spec.provider;
            }
            const spec = injection.inject(name);
            return spec.provider.call(context, adhoc_dependencies);
        },

        run: function (context, adhoc_dependencies) {
            if (!stores.providers.main) {
                throw 'No main method registered. Please register one by running injector.registerMain() before running the app';
            }
            return injection.get('main', context, adhoc_dependencies);
        },

        getType: function (name) {
            return (stores.fakes[name] || stores.types[name]).type;
        }
    };

    const util = {
        clearState: () => clearState(stores)
    };

    return {...registration, ...injection, ...util};
}
