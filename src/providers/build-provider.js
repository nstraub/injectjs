import * as providers                            from './index';
import {compose, join, lensIndex, over, toUpper} from 'ramda';
import {identity}        from 'ramda';



const identityf = function (a) {
    return function () {
        return identity(a);
    };
};

const toTitle = compose(
    join(''),
    over(lensIndex(0), toUpper)
);

export default function buildProvider(runtimeStores, descriptor, ...args2) {
    let templateFactory,
        name = descriptor.name,
        provider_name,
        args = [descriptor];

    if (!descriptor.lifetime) {
        provider_name = 'provideProvider';
    } else {
        switch (descriptor.lifetime) {
            case 'singleton':
                provider_name = 'provideCached';
                args.push(runtimeStores.singletons);
                break;
            case 'state':
                provider_name = 'provideState';
                args.push(runtimeStores.state);
                break;
            default:
                provider_name = 'provide' + toTitle(descriptor.lifetime);
        }
    }
    templateFactory = providers[provider_name](...args, runtimeStores, ...args2);

    /*    if (descriptor.lifetime === 'state') {
        let provider = templateFactory.provider;
        templateFactory.provider = function checkCache(adhoc) {
            if (runtimeStores.state[name] === undefined) {
                return buildProvider(runtimeStores, descriptor, ...args2).provider.call(this, adhoc);
            }
            let instance = provider.call(this, adhoc);
            if (templateFactory.provider !== checkCache) {
                provider = templateFactory.provider;
                templateFactory.provider = checkCache;
            }
            return instance;
        };
    }*/
    if (descriptor.lifetime === 'singleton') {
        templateFactory = identityf(templateFactory);
        templateFactory.descriptor = descriptor;
    }
    if (name) {
        runtimeStores.cache[name] = templateFactory;
    }
    return templateFactory;
}
