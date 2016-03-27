/*! inject-js - vv0.3.4 - 2016-03-27
* https://github.com/nstraub/injectjs
* Copyright (c) 2016 ; Licensed  */
'use strict';
var injector = (function () {
function Injector() {
    this.types = {};
    this.providers = {};
    this.fakes = {};
    this.state = {};
}

Injector.prototype.DEFAULT_LIFETIME = 'transient';

Injector.prototype.cache = {};

Injector.prototype.roots = {};

/* globals window: false */
/* exported lifetimes */
/* exported old_injector */
/* globals get_dependency_names*/

var lifetimes = ['singleton', 'transient', 'root', 'parent', 'state'];

var old_injector = window.injector;

Injector.prototype.build_anonymous_descriptor = function (name) { // for when inject is called with an anonymous function
    if (typeof name === 'function') {
        return {
            type: name,
            dependencies: get_dependency_names(name)
        };
    } else {
        return {
            type: name.pop(),
            dependencies: name
        };
    }
};

/*----------------------
 -- Injection Methods --
 ----------------------*/
Injector.prototype._inject = function (name, descriptor, parent, root) {
    var dependency_providers;

    if (!descriptor) {
        if (parent) {
            return null;
        } else {
            throw 'There is no dependency named "' + name + '" registered.';
        }
    }

    if ((descriptor.lifetime === 'singleton' || descriptor.lifetime === 'state') && this.cache[descriptor.name] && this.cache[descriptor.name].hashCode === descriptor.hashCode) {
        return this.cache[descriptor.name];
    }

    if (!(parent || root)) {
        root = ++this.currentHashCode;
    }
    
    if (descriptor.provider && descriptor.provider !== parent) {
        return this._inject(descriptor.provider, this.getDescriptor(descriptor.provider), descriptor.name, root);
    }

    dependency_providers = {};
    var counter = 0;
    _.each(descriptor.dependencies, _.bind(function (dependency_name) {
        var provider = this._inject(dependency_name, this.getDescriptor(dependency_name), descriptor.name, root);
        if (dependency_providers[dependency_name]) {
            dependency_providers[dependency_name + counter++] = provider;
        } else {
            dependency_providers[dependency_name] = provider;
        }
    }, this));

    var provider = this.build_provider(descriptor.name, descriptor, dependency_providers, root);
    return provider;
};

Injector.prototype.getDescriptor = function (name) {
    return typeof name === 'string' ? this.fakes[name] || this.types[name] || this.providers[name] : this.build_anonymous_descriptor(name);
};

Injector.prototype.inject = function (name) {
    return this._inject(name, this.getDescriptor(name));
};

Injector.prototype.get = function (name, context, adhoc_dependencies) {
    var provider = this.inject(name);
    if (context) {
        return provider.call(context, adhoc_dependencies);
    }
    return provider(adhoc_dependencies);
};

Injector.prototype.run = function (context, adhoc_dependencies) {
    if (!this.providers.main) {
        throw 'No main method registered. Please register one by running injector.registerMain() before running the app';
    }
    return this.get('main', context, adhoc_dependencies);
};

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

/* global Injector */
Injector.prototype.harness = function (func) {
    var _this = this;
    return function (adhoc_dependencies) {
        return _this.inject(func)(adhoc_dependencies);
    };
};

Injector.prototype.removeFake = function (name) {
    delete this.fakes[name];
};

Injector.prototype.flushFakes = function () {
    this.fakes = {};
};

/* globals old_injector: false */
/* globals injector: false */
/* globals angular: false */
/* globals window: false */
/* exported get_dependency_names*/

var get_dependency_names = (function () {
    var dependency_pattern = /^function ?\w* ?\(((?:\w+|(?:, ?))+)\)/;
    var separatorPattern = /, ?/;
    return function get_dependency_names(type) {
        var serialized_type = type.toString();
        var serialized_dependencies;

        if (serialized_dependencies = dependency_pattern.exec(serialized_type)) {
            return serialized_dependencies[1].split(separatorPattern);
        } else {
            return null;
        }
    };
}());

Injector.prototype.getType = function (name) {
    var type = this.fakes[name] || this.types[name];

    if (type) {
        return type.type;
    }
    return null;
};

Injector.prototype.extend = function (parent, child) {
    var parent_type = this.types[parent];
    if (parent_type) {
        child.prototype = this.get(parent);
    } else {
        throw 'No type "' + parent + '" found.';
    }
};

Injector.prototype.noConflict = function () {
    window.injector = old_injector;
};

/*-------------------
 -- State Lifetime --
 -------------------*/

Injector.prototype.clearState = function () {
    this.state = {};
    var _this = this;
    _.each(this.types, _.bind(function (descriptor, key) {
        if (descriptor.lifetime === 'state') {
            Object.keys(this.cache).forEach(function (name) {
                "use strict";
                if (~name.indexOf(key)) {
                    delete _this.cache[name];
                }
            });

        }
    }, this));
};

var listener = function () {};

if (window.angular && angular.module) {
    angular.module('injectJS', []).service('$injectJS', [Injector]).run(['$rootScope', '$injectJS', function ($rootScope, $injectJS) {
        $rootScope.$on('$locationChangeStart', function () {
            $injectJS.clearState();
        });
    }]);
}
listener = function () {
    injector.clearState();
};

window.addEventListener('hashchange', listener);

Injector.prototype.removeDefaultListener = function () {
    window.removeEventListener('hashchange', listener);
};

return new Injector();
}());