import {forEachObjIndexed as each} from 'ramda';

export default function (injector) {

    each(function (provider, key) {
        if (injector.cache[key]) {
            delete injector.cache[key];
        }
    }, injector.state);
    injector.state = {};
}
