import _ from 'lodash';


export default function _assert_circular_references(spec, dependencies, path) {
    let parent = spec.parent;
    if (!parent) {
        return;
    }

    let name = spec.descriptor.name || spec.descriptor.type;
    path.unshift(name);

    let provider = parent.descriptor.provider;
    if (_.isArray(provider)) {
        provider = provider[provider.length - 1];
    }

    let parent_name = parent.descriptor.name;
    if (provider !== name && dependencies.indexOf(parent_name) > -1) {
        throw 'Circular Reference Detected: ' + parent_name + ' -> ' +
                path.join(' -> ') + ' -> ' + parent_name;
    }
    _assert_circular_references(parent, dependencies, path);
};
