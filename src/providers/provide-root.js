import uuid            from '../util/uuid';
import {provideCached} from './index';

export default function (descriptor, ...args) {
    const factory = function (spec) {
        return {
            id: uuid.getNext(),
            descriptor,
            spec,
            provider(adhoc) {
                let root = spec.root;

                if (root === undefined) {
                    root = {};
                }
                if (root.roots === undefined) {
                    root.roots = {};
                }

                return provideCached(descriptor, root.roots, args[0], spec.parent, spec.root)
                    .provider
                    .call(this, adhoc);
            }
        };
    };

    factory.descriptor = descriptor;
    return factory;
};
