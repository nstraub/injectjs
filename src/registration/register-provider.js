import {register} from './index';


export function registerProvider(stores, name, provider) {
    if (stores.cache[name]) {
        delete stores.cache[name];
    }
    stores.providers[name] = register(name, provider);
}

export function registerMain(stores, provider) {
    registerProvider(stores, 'main', provider);
}
