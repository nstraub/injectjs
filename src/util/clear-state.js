import {forEachObjIndexed as each} from 'ramda';

export default function (runtimeStores) {

    each(function (provider, key) {
        if (runtimeStores.cache[key]) {
            delete runtimeStores.cache[key];
        }
        delete runtimeStores.state[key];
    }, runtimeStores.state);
}
