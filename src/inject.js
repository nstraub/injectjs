import Injector                                                                      from './inject.constructor';
import {buildGraph, getDescriptor, inject} from './injection';

/*----------------------
 -- Injection Methods --
 ----------------------*/
Injector.prototype.inject = function (name) {
    return inject(this, buildGraph(this, name, getDescriptor(this, name)));
};

Injector.prototype.get = function (name, adhoc_dependencies, context) {
    var provider = this.inject(name);
    return provider.call(context, adhoc_dependencies);
};

Injector.prototype.run = function (context, adhoc_dependencies) {
    if (!this.providers.main) {
        throw 'No main method registered. Please register one by running injector.registerMain() before running the app';
    }
    return this.get('main', context, adhoc_dependencies);
};
