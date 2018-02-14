import {assertLifetime, register} from 'registration';


export default function (targetStore, name, type, lifetime, provider) {
    assertLifetime(lifetime);

    let newDescriptor = register(name, type, lifetime);

    if (provider) {
        newDescriptor.provider = register(name + '::provider', provider);
    }
    targetStore[name] = newDescriptor;
}
