import * as providers                            from './index';
import {compose, join, lensIndex, over, toUpper} from 'ramda';


const toTitle = compose(
    join(''),
    over(lensIndex(0), toUpper)
);

export default function (runtimeStores, descriptor, ...args2) {
    let item,
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
                provider_name = 'provideCached';
                args.push(runtimeStores.state);
                break;
            default:
                provider_name = 'provide' + toTitle(descriptor.lifetime);
        }
    }
    item = providers[provider_name](...args, runtimeStores, ...args2);

    if (name && !descriptor.provider) {
        runtimeStores.cache[name] = item;
    }
    return item;
}
