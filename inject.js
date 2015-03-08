Injector = (function () {
    var lifetimes = ['singleton', 'transient', 'instance', 'parent'],
        singletons = {},
        providers = {
            provide_transient: function (type, dependencies) {
                function aux(args) {
                    return type.apply(this, args);
                }

                aux.prototype = type.prototype;

                return function () {
                    return new aux(dependencies);
                }
            },
            provide_singleton: function (name, type, dependencies) {
                if (!singletons[ name]) {
                    var singleton = providers.provide_transient(type, dependencies);
                    singletons[name] = function () {
                        return singleton;
                    }
                }
                return singletons[name];
            }
        };

    function Injector() {
        this.types = {};
        this.providers = {};
    }


    Injector.prototype.register = function(where, name, type, lifetime) {
        var realType, dependencies;
        var destination = this[where];
        if (typeof destination === 'undefined') {
            throw 'invalid destination "' + where + '" provided. Valid destinations are types, providers, and main'
        }

        if (typeof name !== 'string' || name === '') {
            throw 'Type must have a name';
        }

        if (!type) {
            throw 'no type was passed';
        } else if (typeof type === 'function') {
            dependencies = null;
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
            dependencies: dependencies
        };
        if (lifetime) {
            result.lifetime = lifetime;
        }
        destination[name] = result;
    };

    Injector.prototype.registerType = function (name, type, lifetime) {
        lifetime = lifetime || 'transient';

        if (lifetimes.indexOf(lifetime) === -1) {
            throw 'invalid lifetime "' + lifetime + '" provided. Valid lifetimes are singleton, transient, instance and parent'
        }

        this.register('types', name, type, lifetime);
    };

    Injector.prototype.registerProvider = function (name, provider) {
        this.register('providers', name, provider);
    };

    Injector.prototype.registerMain = function (main) {
        this.register('providers', 'main', main);
    };

    Injector.prototype.inject = function (name) {
        var descriptor, type, dependency_names, dependency_names_length, dependencies, is_provider, instantiator;
        descriptor = this.types[name];
        if (!descriptor) {
            is_provider = true;
            descriptor = this.providers[name];
        }

        type = descriptor.type;
        dependency_names = descriptor.dependencies;
        dependencies = [];

        if (dependency_names) {
            dependency_names_length = dependency_names.length;
            for (var i = 0; i < dependency_names_length; i++) {
                dependencies.push(this.instantiate(dependency_names[i]));
            }
        }

        if (is_provider) {
            return function () {
                return type.apply(this, dependencies);
            }
        } else {
            if (descriptor.lifetime === 'singleton') {
                return providers.provide_singleton(name, type, dependencies);
            } else {
                return providers.provide_transient(type, dependencies);
            }
        }
    };

    Injector.prototype.instantiate = function (name) {
        return this.inject(name)();
    };

    return new Injector();
})();