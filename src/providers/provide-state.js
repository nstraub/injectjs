import {provideCached} from './index';


export default function (descriptor, cache, ...args) {
    const factory = function (spec) {
        return provideCached(descriptor, cache, args[0], spec.parent, spec.root);
    };
    factory.descriptor = descriptor;
    return factory;
}
