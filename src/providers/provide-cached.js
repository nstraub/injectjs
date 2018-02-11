import {provideTransient} from './index';

export default function (descriptor, cache) {
    const name = descriptor.name;

    if (!cache[name]) {
        let dependency_to_cache = provideTransient(descriptor);

        cache[name] = function (graph, adhoc_dependencies) {
            let cached;
            if (typeof dependency_to_cache === 'function') {
                dependency_to_cache = dependency_to_cache.call(this, graph, adhoc_dependencies);
                cached = function () {
                    return dependency_to_cache;
                };
                cached.hashCode = cache[name].hashCode;
                cache[name] = cached;
            }
            return dependency_to_cache;
        };
    }
    return cache[name];
};
