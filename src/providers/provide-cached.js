import {provideTransient} from './index';


export default function (descriptor, cache, ...args) {
    const name = descriptor.name;

    if (!cache[name]) {
        let dependency_to_cache = provideTransient(descriptor, ...args);

        dependency_to_cache.instance = dependency_to_cache.provider();
        dependency_to_cache.provider = function () {
            return dependency_to_cache.instance;
        };

        cache[name] = dependency_to_cache;
    }
    return cache[name];
};
