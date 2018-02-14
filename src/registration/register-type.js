import {registerInstantiable} from 'registration/index';


export default function (runtimeStores, name, type, lifetime, provider) {
    if (lifetime === 'singleton' && runtimeStores.cache[name]) {
        throw 'you cannot re-register a singleton that has already been instantiated';
    }

    registerInstantiable(runtimeStores.types, name, type, lifetime || runtimeStores.DEFAULT_LIFETIME, provider);
}
