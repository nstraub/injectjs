/**
 * Created by nico on 07/04/2015.
 */
var get_dependency_names = (function () {
    var dependency_pattern = /^function ?\w* ?\(((?:\w+|(?:, ?))+)\)/;
    return function get_dependency_names(type) {
        var serialized_type = type.toString();
        var serialized_dependencies;

        if (serialized_dependencies = dependency_pattern.exec(serialized_type)) {
            return serialized_dependencies[1].split(/, ?/);
        } else {
            return null;
        }
    }
}());


Injector.prototype.registerType = function (name, type, lifetime, provider) {
    lifetime = lifetime || 'transient';

    if (!~lifetimes.indexOf(lifetime)) {
        throw 'invalid lifetime "' + lifetime + '" provided. Valid lifetimes are singleton, transient, instance and parent'
    }

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
    lifetime = lifetime || 'transient';

    if (!~lifetimes.indexOf(lifetime)) {
        throw 'invalid lifetime "' + lifetime + '" provided. Valid lifetimes are singleton, transient, instance and parent'
    }

    this._register('fakes', name, type, lifetime);
};


Injector.prototype._register = function (where, name, type, lifetime) {
    var realType, dependencies;
    var destination = this[where];
    if (typeof destination === 'undefined') {
        throw 'invalid destination "' + where + '" provided. Valid destinations are types, providers, fakes and main'
    }

    if (typeof name !== 'string' || name === '') {
        throw 'Type must have a name';
    }

    if (!type) {
        throw 'no type was passed';
    } else if (typeof type === 'function') {
        dependencies = get_dependency_names(type);
        realType = type;
    } else {
        realType = type.pop();
        dependencies = type;
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
Injector.prototype.build_anonymous_descriptor = function (name) { // for when inject is called with an anonymous function
    if (typeof name === 'function') {
        return {
            type: name,
            dependencies: get_dependency_names(name)
        }
    } else {
        return {
            type: name.pop(),
            dependencies: name
        }
    }
};
