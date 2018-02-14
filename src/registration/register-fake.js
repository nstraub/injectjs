import {registerInstantiable} from './index';


export default function (runtimeStores, name, type, lifetime, provider) {
    registerInstantiable(runtimeStores.fakes, name, type, lifetime || runtimeStores.DEFAULT_LIFETIME, provider);
}
