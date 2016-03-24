/* globals Injector: false */

function map_dependencies(dependency_providers, adhoc_dependencies) {
    var _this = this,
        adhoc_dependency_providers = {};

    _.each(adhoc_dependencies, function (dependency, key) {
        adhoc_dependency_providers[key] = function () {
            return dependency;
        };
    });
    _.assign(dependency_providers, adhoc_dependency_providers);

    return _.map(dependency_providers, function (provider, key) {
        if (!provider) {
            throw 'There is no dependency named "' + key + '" registered.';
        }
        return provider.call(_this, adhoc_dependencies);
    });
}

Injector.prototype.cache = {};
var createObject = Object.create;
Injector.prototype.provide_transient = function (type, dependency_providers) {
    return function (adhoc_dependencies) {
        var instance = createObject(type.prototype);

        type.apply(instance, map_dependencies(dependency_providers, adhoc_dependencies));
        return instance;
    };
};
Injector.prototype.provide_singleton = function (name, type, dependency_providers, singleton_cache) {
    var _this = this;
    if (!singleton_cache[name]) {
        var dependency_to_cache = this.provide_transient(type, dependency_providers);
        singleton_cache[name] = function (adhoc_dependencies) {
            if (typeof dependency_to_cache === 'function') {
                dependency_to_cache = dependency_to_cache(adhoc_dependencies);
                _this.cache[name] = singleton_cache[name] = function () {
                    return dependency_to_cache;
                };
            }
            return dependency_to_cache;
        };
    }
    return singleton_cache[name];
};
Injector.prototype.provide_provider = function(dependency_providers, type) {
    return function (adhoc_dependencies) {
        var dependencies = map_dependencies.call(this, dependency_providers, adhoc_dependencies);
        return type.apply(this, dependencies);
    };
};

(function () {
    var singletons = {};
    Injector.prototype.build_provider = function (name, descriptor, dependency_providers) {
        if (!descriptor.lifetime) {
            return this.cache[name] = this.provide_provider(dependency_providers, descriptor.type);
        }
        switch (descriptor.lifetime) {
            case 'singleton':
                return this.cache[name] = this.provide_singleton(name, descriptor.type, dependency_providers, singletons);
            case 'state':
                return this.cache[name] = this.provide_singleton(name, descriptor.type, dependency_providers, this.state);
            default:
                return this.cache[name] = this.provide_transient(descriptor.type, dependency_providers);
        }
    };
}());
