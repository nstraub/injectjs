/**
 * Created by nico on 07/04/2015.
 */
'use strict';
var providers = (function () {
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
            return provider.call(_this);
        });
    }

    var singletons = {},
        cache = {},
        old_providers = providers;

    return {
        cache: {},
        noConflict: function () {
            window.providers = old_providers;
        },
        provide_transient: function (type, dependency_providers) {
            function aux(args) {
                return type.apply(this, args);
            }

            aux.prototype = type.prototype;

            return function (adhoc_dependencies) {
                var dependencies = map_dependencies(dependency_providers, adhoc_dependencies);
                return new aux(dependencies);
            }
        },
        provide_singleton: function (name, type, dependency_providers, singleton_cache) {
            var _this = this;
            if (!singleton_cache[name]) {
                var dependency_to_cache = this.provide_transient(type, dependency_providers);
                singleton_cache[name] = function (adhoc_dependencies) {
                    dependency_to_cache = dependency_to_cache(adhoc_dependencies);
                    _this.cache[name] = singleton_cache[name] = function () {
                        return dependency_to_cache;
                    };
                    return dependency_to_cache;
                }
            }
            return singleton_cache[name];
        },
        provide_provider: function(dependency_providers, type) {
            return function (adhoc_dependencies) {
                var dependencies = map_dependencies.call(this, dependency_providers, adhoc_dependencies);
                return type.apply(this, dependencies);
            }
        },
        build_provider: function (name, descriptor, dependency_providers, cache) {
            if (!descriptor.lifetime) {
                return this.cache[name] = this.provide_provider(dependency_providers, descriptor.type);
            }
            switch (descriptor.lifetime) {
                case 'singleton':
                    return this.cache[name] = this.provide_singleton(name, descriptor.type, dependency_providers, singletons);
                case 'state':
                    return this.cache[name] = this.provide_singleton(name, descriptor.type, dependency_providers, cache);
                default:
                    return this.cache[name] = this.provide_transient(descriptor.type, dependency_providers);
            }
        }

    }
}());
