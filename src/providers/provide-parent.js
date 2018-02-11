import {provideTransient} from './index';

export default function (descriptor) {
    return function (current_template, adhoc_dependencies) {
        var parent_template = current_template,
            topmost_parent = parent_template,
            dependency_name = descriptor.name;
        while (parent_template = parent_template.parent) {
            if (parent_template.children && parent_template.children[dependency_name]) {
                topmost_parent = parent_template;
                break;
            } else if (parent_template.descriptor.dependencies && ~parent_template.descriptor.dependencies.indexOf(dependency_name)) {
                topmost_parent = parent_template;
            }
        }

        parent_template = topmost_parent;

        parent_template.children = parent_template.children || {};


        if (!parent_template.children[dependency_name] || parent_template.children[dependency_name] === 'building') {
            parent_template.children[dependency_name] = 'building';
            parent_template.children[dependency_name] = provideTransient(descriptor).call(this, current_template, adhoc_dependencies);
        }
        return parent_template.children[dependency_name];
    };

}
