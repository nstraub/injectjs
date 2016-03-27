/* globals Injector: false */
/* globals _: false */

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

var createObject = Object.create;
Injector.prototype.provide_transient = function (type, dependency_providers) {
    return function (adhoc_dependencies) {
        var instance = createObject(type.prototype);

        type.apply(instance, map_dependencies(dependency_providers, adhoc_dependencies));
        return instance;
    };
};
Injector.prototype.provide_singleton = function (name, type, dependency_providers, singleton_cache) {
    if (!singleton_cache[name]) {
        var dependency_to_cache = this.provide_transient(type, dependency_providers);
        singleton_cache[name] = function (adhoc_dependencies) {
            var cached;
            if (typeof dependency_to_cache === 'function') {
                dependency_to_cache = dependency_to_cache(adhoc_dependencies);
                cached = function () {
                    return dependency_to_cache;
                };
                cached.hashCode = singleton_cache[name].hashCode;
                singleton_cache[name] = cached;
            }
            return dependency_to_cache;
        };
    }
    return singleton_cache[name];
};

Injector.prototype.provide_root = function (name, type, dependency_providers, root) {
    if (!this.roots[root]) {
        this.roots[root] = {};
    }
    return _.bind(function (adhoc_dependencies) {
        if (!this.roots[root][name]) {
            this.roots[root][name] = this.provide_transient(type, dependency_providers)(adhoc_dependencies);
        }
        return this.roots[root][name];
    }, this);
};

Injector.prototype.provide_provider = function(dependency_providers, type) {
    return function (adhoc_dependencies) {
        var dependencies = map_dependencies.call(this, dependency_providers, adhoc_dependencies);
        return type.apply(this, dependencies);
    };
};

(function () {
    var singletons = {};
    Injector.prototype.build_provider = function (name, descriptor, dependency_providers, root) {
        var item;
        if (!descriptor.lifetime) {
            return this.provide_provider(dependency_providers, descriptor.type);
        }
        switch (descriptor.lifetime) {
            case 'singleton':
                if (singletons[name] && singletons[name].hashCode !== descriptor.hashCode) {
                    delete singletons[name];
                }
                item = this.provide_singleton(name, descriptor.type, dependency_providers, singletons);
                item.hashCode = singletons[name].hashCode = descriptor.hashCode;
                if (!descriptor.provider) {
                    this.cache[descriptor.name] = item;
                }
                break;
            case 'state':
                item = this.provide_singleton(name, descriptor.type, dependency_providers, this.state);
                item.hashCode = descriptor.hashCode;
                if (!descriptor.provider) {
                    this.cache[descriptor.name] = item;
                }
                break;
            case 'root':
                item = this.provide_root(name, descriptor.type, dependency_providers, root);
                break;
            default:
                item = this.provide_transient(descriptor.type, dependency_providers);
        }

        return item;
    };
}());
