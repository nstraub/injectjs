import _      from 'lodash';
import {uuid} from '../util';

import {assertCircularReferences, getDescriptor} from './index';
import {buildProvider}                           from '../providers';

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
        let dependencyDescriptor = getDescriptor(runtimeStores, dependency_name);
        let dependency_spec = buildProvider(runtimeStores, dependencyDescriptor, spec, spec.root);

        dependency_specs.push(dependency_spec);

    });

    spec.dependencies = dependency_specs;
    return spec;

}
