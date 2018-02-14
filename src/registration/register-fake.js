import {registerInstantiable} from './index';


export default function (runtimeStores, name, type, lifetime, provider) {
    if (runtimeStores.cache[name]) {
        delete runtimeStores.cache[name];
    }
    registerInstantiable(runtimeStores.fakes, name, type, lifetime || runtimeStores.DEFAULT_LIFETIME, provider);
}
