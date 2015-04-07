/**
 * Created by nico on 07/04/2015.
 */
'use strict';
var providers = (function () {
    function map_dependencies(dependency_providers) {
        var _this = this;
        return _.map(dependency_providers, function (provider, key) {
            if (!provider) {
                throw 'There is no dependency named "' + key + '" registered.';
            }
            return provider.call(_this);
        });
    }

    var singletons = {},
        old_providers = providers;

    return {
        noConflict: function () {
            window.providers = old_providers;
        },
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
        provide_cached: function (name, type, dependency_providers, cached) {
            if (!cached[name]) {
                var singleton = this.provide_transient(type, dependency_providers)();
                cached[name] = function () {
                    return singleton;
                }
            }
            return cached[name];
        },
        provide_singleton: function (name, type, dependency_providers) {
            return this.provide_cached(name, type, dependency_providers, singletons);
        },
        provide_provider: function(dependency_providers, type) {
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
        },
        build_provider: function (name, descriptor, dependency_providers, state) {
            switch (descriptor.lifetime) {
                case 'singleton':
                    return this.provide_singleton(name, descriptor.type, dependency_providers);
                case 'state':
                    return this.provide_cached(name, descriptor.type, dependency_providers, state);
                default:
                    return this.provide_transient(descriptor.type, dependency_providers);
            }
        }

    }
}());
