import Injector                               from './inject.constructor';
import {register, registerFake, registerType} from './registration';


Injector.prototype.registerType = function (name, type, lifetime, provider) {
    registerType(this, name, type, lifetime, provider);
};

Injector.prototype.registerProvider = function (name, provider) {
    register(this, 'providers', name, provider);
};

Injector.prototype.registerMain = function (main) {
    register(this, 'providers', 'main', main);
};

Injector.prototype.registerFake = function (name, type, lifetime, provider) {
    registerFake(this, name, type, lifetime, provider);
};
