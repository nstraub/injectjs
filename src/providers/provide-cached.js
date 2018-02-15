import {buildGraph}       from '../injection';
import {provideTransient} from './index';


export default function (descriptor, cache, ...args) {
    const name = descriptor.name;

    if (!cache[name]) {
        let dependency_to_cache = provideTransient(descriptor, ...args)(buildGraph(descriptor, ...args));

        let transientProvider = dependency_to_cache.provider;
        dependency_to_cache.provider = function (adhocs) {
            dependency_to_cache.instance = transientProvider.call(this, adhocs);
            if (dependency_to_cache.passiveProviderSpec !== undefined) {
                dependency_to_cache.provider = function () {
                    return dependency_to_cache.passiveProviderSpec.provider.call(this, {instance: dependency_to_cache.instance});
                };
            } else {
                dependency_to_cache.provider = function () {
                    return dependency_to_cache.instance;
                };
            }
            return dependency_to_cache.instance;
        };
        cache[name] = dependency_to_cache;
    }
    return cache[name];
};
