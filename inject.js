'use strict';
var injector = (function () {
    function map_dependencies(dependency_providers) {
        var _this = this;
        return _.map(dependency_providers, function (provider, key) {
            if (!provider) {
                throw 'There is no dependency named "' + key + '" registered.';
            }
            return provider.call(_this);
        });
    }

    var lifetimes = ['singleton', 'transient', 'instance', 'parent'],
        dependency_pattern = /^function ?\w* ?\(((?:\w+|(?:, ?))+)\)/,
        providers = {
            provide_transient: function (type, dependency_providers) {
                function aux(args) {
                    return type.apply(this, args);
                }

                aux.prototype = type.prototype;

                return function () {
                    var dependencies = map_dependencies(dependency_providers);
                    return new aux(dependencies);
                }
            },
            provide_singleton: function (name, type, dependency_providers) {
                if (!injector.singletons[name]) {
                    var singleton = providers.provide_transient(type, dependency_providers)();
                    injector.singletons[name] = function () {
                        return singleton;
                    }
                }
                return injector.singletons[name];
            },
            build_provider: function (name, descriptor, dependency_providers) {
                if (descriptor.lifetime === 'singleton') {
                    return providers.provide_singleton(name, descriptor.type, dependency_providers);
                } else {
                    return providers.provide_transient(descriptor.type, dependency_providers);
                }
            }

        };

    function Injector() {
        this.types = {};
        this.providers = {};
        this.fakes = {};
        this.cache = {};
        this.singletons = {};
    }


    function get_dependency_names(type) {
        var serialized_type = type.toString();
        var serialized_dependencies;

        if (serialized_dependencies = dependency_pattern.exec(serialized_type)) {
            return serialized_dependencies[1].split(/, ?/);
        } else {
            return null;
        }
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

        delete this.cache[name];

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
            dependencies: dependencies
        };
        if (lifetime) {
            result.lifetime = lifetime;
        }
        destination[name] = result;
    };

    Injector.prototype.registerType = function (name, type, lifetime, provider) {
        lifetime = lifetime || 'transient';

        if (lifetimes.indexOf(lifetime) === -1) {
            throw 'invalid lifetime "' + lifetime + '" provided. Valid lifetimes are singleton, transient, instance and parent'
        }

        this.register('types', name, type, lifetime);

        if (provider) {
            this.types[name].provider = provider;
        }
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


    // for when inject is called with an anonymous function
    function build_anonymous_descriptor(name) {
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
    }

    Injector.prototype.inject = function (name, parent) {
        var descriptor, type, dependency_providers, is_provider, provider;
        if (typeof name === 'string') {
            if (this.cache[name]) {
                return this.cache[name];
            }
            descriptor = this.fakes[name] || this.types[name] || this.providers[name];
            is_provider = !!this.providers[name];

        } else {
            descriptor = build_anonymous_descriptor(name);
            is_provider = true;
        }

        if (!descriptor) {
            if (parent) {
                return null;
            } else {
                throw 'There is no dependency named "' + name + '" registered.';
            }
        }

        type = descriptor.type;

        dependency_providers = {};
        _.each(descriptor.dependencies, function (dependency_name) {
            dependency_providers[dependency_name] = this.inject(dependency_name, name);
        }, this);


        if (is_provider) {
            provider = (function (dependency_providers) {
                return function (adhoc_dependencies) {
                    var adhoc_dependency_providers = {};
                    _.each(adhoc_dependencies, function (dependency, key) {
                        adhoc_dependency_providers[key] = function () {
                            return dependency;
                        };
                    });
                    _.assign(dependency_providers, adhoc_dependency_providers);
                    var dependencies = map_dependencies.call(this, dependency_providers);
                    return type.apply(this, dependencies);
                }
            }(dependency_providers));

            if (typeof name === 'string') {
                this.cache[name] = provider;
            }

            return provider;
        } else {
            if (descriptor.provider && descriptor.provider !== parent) {
                return this.cache[name] = this.inject(descriptor.provider, name);
            }
            return this.cache[name] = providers.build_provider(name, descriptor, dependency_providers)
        }
    };

    Injector.prototype.get = function (name, context, adhoc_dependencies) {
        var provider = this.inject(name);
        if (context) {
            return provider.call(context, adhoc_dependencies);
        }
        return provider(adhoc_dependencies);
    };

    Injector.prototype.harness = function (func) {
        var _this = this;
        return function (adhoc_dependencies) {
            return _this.inject(func)(adhoc_dependencies);
        }
    };

    Injector.prototype.run = function (context, adhoc_dependencies) {
        if (!this.providers.main) {
            throw 'No main method registered. Please register one by running injector.registerMain() before running the app';
        }
        return injector.get('main', context, adhoc_dependencies);
    };

    Injector.prototype.flushFakes = function () {
        this.fakes = {};
    };

    Injector.prototype.removeFake = function (name) {
        delete this.fakes[name];
    };

    Injector.prototype.extend = function (parent, child) {
        var parent_type = injector.types[parent];
        if (parent_type) {
            child.prototype = this.get(parent);
        } else {
            throw 'No type "' + parent + '" found.'
        }
    };

    Injector.prototype.clearSingletons = function () {
        this.singletons = {};
        _.each(this.types, function (descriptor, key) {
            if (descriptor.lifetime === 'singleton') {
                delete this.cache[key];
            }
        }, this);
    };

    injector = new Injector();

    window.addEventListener('hashchange', function () {
        injector.clearSingletons();
    });

    return injector;
})();
