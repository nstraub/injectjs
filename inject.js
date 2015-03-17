'use strict';
var injector = (function () {
    var lifetimes = ['singleton', 'transient', 'instance', 'parent'],
        singletons = {},
        providers = {
            provide_transient: function (type, dependency_providers) {
                function aux(args) {
                    return type.apply(this, args);
                }

                aux.prototype = type.prototype;

                return function () {
                    var dependencies = _.map(dependency_providers, function (provider) {
                        return provider();
                    });
                    return new aux(dependencies);
                }
            },
            provide_singleton: function (name, type, dependency_providers) {
                if (!singletons[ name]) {
                    var singleton = providers.provide_transient(type, dependency_providers)();
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
        this.fakes = {};
    }


    Injector.prototype.register = function(where, name, type, lifetime) {
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

    Injector.prototype.getType = function (name) {
        var type = this.fakes[name] || this.types[name];

        if (type) {
            return type.type;
        }
        return null
    };

    Injector.prototype.registerProvider = function (name, provider) {
        this.register('providers', name, provider);
    };

    Injector.prototype.registerMain = function (main) {
        this.register('providers', 'main', main);
    };

    Injector.prototype.registerFake = function (name, type, lifetime) {
        lifetime = lifetime || 'transient';

        if (lifetimes.indexOf(lifetime) === -1) {
            throw 'invalid lifetime "' + lifetime + '" provided. Valid lifetimes are singleton, transient, instance and parent'
        }

        this.register('fakes', name, type, lifetime);
    };


    Injector.prototype.inject = function (name) {
        var descriptor, type, dependency_names, dependency_names_length, dependency_providers, is_provider, instantiator;
        if (typeof name === 'string') {
            descriptor = this.fakes[name];
            if (!descriptor) {
                descriptor = this.types[name];
            }

            if (!descriptor) {
                is_provider = true;
                descriptor = this.providers[name];
            }
        } else {
            if (typeof name === 'function') {
                descriptor = {
                    type: name,
                    dependencies: null
                }
            } else {
                descriptor = {
                    type: name.pop(),
                    dependencies: name
                }
            }
            is_provider = true;
        }

        if (!descriptor) {
            throw 'There is no dependency named "' + name + '" registered.';
        }

        type = descriptor.type;
        dependency_names = descriptor.dependencies;
        dependency_providers = [];

        if (dependency_names) {
            dependency_names_length = dependency_names.length;
            for (var i = 0; i < dependency_names_length; i++) {
                dependency_providers.push(this.inject(dependency_names[i]));
            }
        }

        if (is_provider) {
            return function () {
                var dependencies = _.map(dependency_providers, function (provider) {
                    return provider();
                });

                return type.apply(this, dependencies);
            }
        } else {
            if (descriptor.lifetime === 'singleton') {
                return providers.provide_singleton(name, type, dependency_providers);
            } else {
                return providers.provide_transient(type, dependency_providers);
            }
        }
    };

    Injector.prototype.instantiate = function (name) {
        return this.inject(name)();
    };

    Injector.prototype.harness = function (func) {
        var _this = this;
        return function () {
            return _this.inject(func)();
        }
    };

    return new Injector();
})();
