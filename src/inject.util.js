import Injector             from './inject.constructor';
import {getDependencyNames, getType, clearState} from './util';

const get_dependency_names = getDependencyNames;

export {get_dependency_names};

Injector.prototype.getType = function (name) {
    return getType(this, name);
};

Injector.prototype.clearState = function () {
    clearState(this);
};
