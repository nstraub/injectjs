import {mapDependencies} from './index';

export default function (descriptor) {
    return function (current_template, adhoc_dependencies) {
        var dependencies = mapDependencies(this, adhoc_dependencies, current_template);
        return descriptor.type.apply(this, dependencies);
    };
}
