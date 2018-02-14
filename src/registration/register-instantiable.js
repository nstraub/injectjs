import {assertLifetime, register} from 'registration';


export default function (targetStore, name, type, lifetime, provider) {
    assertLifetime(lifetime);

    let newDescriptor = register(name, type, lifetime);

    if (provider) {
        newDescriptor.provider = register(name + '::passive', provider);
        newDescriptor.provider.dependencies.shift();
    }
    targetStore[name] = newDescriptor;
}
