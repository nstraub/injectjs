import {registerType, registerFake, registerProvider, registerMain} from 'registration';
import {buildGraph, getDescriptor}                                  from './injection';
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
        singletons: {},
        DEFAULT_LIFETIME: 'transient'
    };

    const registration = {
        registerType: curry(registerType)(stores),
        registerFake: curry(registerFake)(stores),
        registerProvider: curry(registerProvider)(stores),
        registerMain: curry(registerMain)(stores)
    };

    const injection = {

        inject: function (name) {
            let descriptor = getDescriptor(stores, name);
            if (stores.cache[name] && stores.cache[name].descriptor.hashCode === descriptor.hashCode) {
                return stores.cache[name](buildGraph(descriptor, stores));
            }
            return buildProvider(stores, descriptor)(buildGraph(descriptor, stores));
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
