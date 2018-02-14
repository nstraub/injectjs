import {provideCached} from './index';
import {last}                            from 'ramda';

export default function (descriptor, ...args) {
    const root = last(args);

    if (root.roots === undefined) {
        root.roots = {};
    }

    return provideCached(descriptor, root.roots, ...args);
};
