import _each      from 'lodash/each';
import {uuid} from '../util';

import {assertCircularReferences, buildGraph, getDescriptor} from './index';
import {buildProvider}                                       from '../providers';


const getCachedOrBuild = function (cache, runtimeStores, descriptor) {
    if (cache && cache.descriptor.hashCode === descriptor.hashCode) {
        return cache;
    } else {
        return buildProvider(runtimeStores, descriptor);
    }
};

let adhocProvider = function (spec, dependency_name) {
    return {
        id: uuid.getNext(),
        parent: spec,
        root: spec.root,
        provider: function (adhocs) {
            return adhocs[dependency_name];
        }
    };
};
export default function (descriptor, runtimeStores, parent, root) {
    let spec = {}, dependency_specs = [];

    spec.id = uuid.getNext();
    spec.descriptor = descriptor;
    spec.parent = parent || undefined;
    spec.root = root || spec;

    if (root && descriptor.dependencies) {
        assertCircularReferences(spec, descriptor.dependencies, []);
    }

    _each(descriptor.dependencies, function (dependency_name) {
        let dependency_spec;
        let dependencyDescriptor = getDescriptor(runtimeStores, dependency_name.split('::provider')[0]);

        if (dependencyDescriptor === undefined) {
            dependency_spec = adhocProvider(spec, dependency_name);
        } else {
            dependencyDescriptor.name = dependency_name;
            let dependencyGraph = buildGraph(dependencyDescriptor, runtimeStores, spec, spec.root);

            dependency_spec = getCachedOrBuild(runtimeStores.cache[dependency_name], runtimeStores, dependencyDescriptor)(dependencyGraph);
        }
        dependency_specs.push(dependency_spec);

    });

    spec.dependencies = dependency_specs;

    return spec;
}
