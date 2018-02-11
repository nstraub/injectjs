import {assertLifetime, register} from './index';

export default function (injector, name, type, lifetime, provider) {
    lifetime = lifetime || injector.DEFAULT_LIFETIME;

    assertLifetime(lifetime);

    register(injector, 'fakes', name, type, lifetime);

    if (provider) {
        injector.fakes[name].provider = provider;
    }
}
