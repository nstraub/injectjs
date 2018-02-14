import {register} from './index';


export function registerProvider(stores, name, provider) {
    stores.providers[name] = register(name, provider);
}

export function registerMain(stores, provider) {
    registerProvider(stores, 'main', provider);
}
