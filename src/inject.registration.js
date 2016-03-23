/**
 * Created by nico on 07/04/2015.
 */
/* globals Injector: false */
/* globals lifetimes: false */
/* globals get_dependency_names*/

function assertLifetime (lifetime) {
    if (!~lifetimes.indexOf(lifetime)) {
        throw 'invalid lifetime "' + lifetime + '" provided. Valid lifetimes are singleton, transient, instance and parent';
    }
}

Injector.prototype.currentHashCode = 1;

Injector.prototype.registerType = function (name, type, lifetime, provider) {
    lifetime = lifetime || this.DEFAULT_LIFETIME;

    assertLifetime(lifetime);

    this._register('types', name, type, lifetime);

    if (provider) {
        this.types[name].provider = provider;
    }
};

Injector.prototype.registerProvider = function (name, provider) {
    this._register('providers', name, provider);
};

Injector.prototype.registerMain = function (main) {
    this._register('providers', 'main', main);
};

Injector.prototype.registerFake = function (name, type, lifetime) {
    lifetime = lifetime || this.DEFAULT_LIFETIME;

    assertLifetime(lifetime);

    this._register('fakes', name, type, lifetime);
};


Injector.prototype._register = function (where, name, type, lifetime) {
    var realType, dependencies, destination;

    if (typeof (destination = this[where]) === 'undefined') {
        throw 'invalid destination "' + where + '" provided. Valid destinations are types, providers, fakes and main';
    }

    if (typeof name !== 'string' || name === '') {
        throw 'Type must have a name';
    }

    if (!type) {
        throw 'no type was passed';
    } else if (typeof type === 'function') {
        dependencies = type.$inject || get_dependency_names(type);
        realType = type;
    } else if (Array.isArray(type)) {
        realType = type[type.length -1];

        if (type.$inject || realType.$inject) {
            throw 'passed type cannot have both array notation and the $inject property populated';
        }
        dependencies = type.slice(0, type.length - 1);
    } else {
        throw 'type must be a function or an array';
    }

    if (typeof realType !== 'function') {
        throw 'no type was passed';
    }

    var result = {
        name: name,
        type: realType,
        dependencies: dependencies,
        hashCode: this.currentHashCode++
    };
    if (lifetime) {
        result.lifetime = lifetime;
    }
    destination[name] = result;
};
