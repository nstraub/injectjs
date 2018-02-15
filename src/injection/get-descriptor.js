import {buildAnonymousDescriptor} from './index';

export default function (stores, name) {
    if (typeof name === 'string') {
        return stores.fakes[name] || stores.types[name] || stores.providers[name];
    } else if (typeof name === 'undefined') {
        return {};
    }
    return buildAnonymousDescriptor(name);
}
