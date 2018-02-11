import Injector  from './inject.constructor';
import {harness} from './testing';

Injector.prototype.harness = function (func) {
    return harness(this, func);
};

Injector.prototype.removeFake = function (name) {
    delete this.fakes[name];
};

Injector.prototype.flushFakes = function () {
    this.fakes = {};
};
