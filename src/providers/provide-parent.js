import {provideCached} from './index';


export default function (descriptor, ...args) {
    return {
        provider: function () {
            let parent = args[args.length - 2];
            let topmost_parent;

            while (parent) {
                if (parent.children && parent.children[descriptor.name]) {
                    topmost_parent = parent;
                    break;
                }
                if (parent.descriptor.dependencies.indexOf(descriptor.name) > -1) {
                    topmost_parent = parent;
                }
                parent = parent.parent;
            }

            if (topmost_parent === undefined) {
                topmost_parent = {};
            }
            if (topmost_parent.children === undefined) {
                topmost_parent.children = {};
            }

            return provideCached(descriptor, topmost_parent.children, ...args)
                .provider
                .call(this);
        }
    };
}
