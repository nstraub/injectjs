import {identity} from 'ramda';


function liftuf(fn) {
    return function (a) {
        return function () {
            return fn(a);
        };
    };
}

export const identityf = liftuf(identity);
