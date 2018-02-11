import {provideTransient} from './index';

export default function (descriptor) {
    const name = descriptor.name;

    return function (current_template, adhoc_dependencies) {
        const roots = current_template.root.roots = current_template.root.roots || {};

        if (!roots[name]) {
            roots[name] = provideTransient(descriptor).call(this, current_template, adhoc_dependencies);
        }
        return roots[name];
    };
};
