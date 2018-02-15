import _      from 'lodash';
import {uuid} from '../util';

import {assertCircularReferences, buildGraph, getDescriptor} from './index';
import {buildProvider}                                       from '../providers';


export default function (descriptor, runtimeStores, parent, root) {
    let spec = {}, dependency_specs = [];

    spec.id = uuid.getNext();
    spec.descriptor = descriptor;
    spec.parent = parent || undefined;
    spec.root = root || spec;

    if (root && descriptor.dependencies) {
        assertCircularReferences(spec, descriptor.dependencies, []);
    }

    _.each(descriptor.dependencies, function (dependency_name) {
        let dependency_spec;
        let dependencyDescriptor = getDescriptor(runtimeStores, dependency_name.split('::provider')[0]);
        if (dependencyDescriptor === undefined) {
            dependency_spec = {
                id: uuid.getNext(),
                parent: spec,
                root: spec.root,
                provider: function (adhocs) {
                    return adhocs[dependency_name];
                }
            };
        } else {
            dependencyDescriptor.name = dependency_name;
            if (runtimeStores.cache[dependency_name] && runtimeStores.cache[dependency_name].descriptor.hashCode === dependencyDescriptor.hashCode) {
                let cached_template = runtimeStores.cache[dependency_name];
                dependency_spec = cached_template(buildGraph(dependencyDescriptor, runtimeStores, spec, spec.root));
            } else {
                dependency_spec =
                    buildProvider(runtimeStores, dependencyDescriptor)(buildGraph(dependencyDescriptor, runtimeStores, spec, spec.root));
            }
        }
        dependency_specs.push(dependency_spec);

    });

    spec.dependencies = dependency_specs;

    return spec;
}
