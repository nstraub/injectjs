import {assertLifetime, register} from './index';

export default function (injector, name, type, lifetime, provider) {
    lifetime = lifetime || injector.DEFAULT_LIFETIME;

    assertLifetime(lifetime);

    if (lifetime === 'singleton' && injector.cache[name]) {
        throw 'you cannot re-register a singleton that has already been instantiated';
    }

    register(injector, 'types', name, type, lifetime);

    if (provider) {
        injector.types[name].provider = provider;
    }
}
