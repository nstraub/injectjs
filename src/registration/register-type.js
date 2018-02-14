import {registerInstantiable} from 'registration/index';


export default function (runtimeStores, name, type, lifetime, provider) {
    if (runtimeStores.cache[name]) {
        if (lifetime === 'singleton') {
            throw 'you cannot re-register a singleton that has already been instantiated';
        }
        delete runtimeStores.cache[name];
    }

    registerInstantiable(runtimeStores.types, name, type, lifetime || runtimeStores.DEFAULT_LIFETIME, provider);
}
