import {buildAnonymousDescriptor} from './index';

export default function (injector, name) {
    if (typeof name === 'string') {
        return injector.fakes[name] || injector.types[name] || injector.providers[name];
    } else if (typeof name === 'undefined') {
        return {};
    }
    return buildAnonymousDescriptor(name);
}
