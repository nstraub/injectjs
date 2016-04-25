/*! inject-js - v0.4.14 - 2016-04-25
* https://github.com/nstraub/injectjs
* Copyright (c) 2016 ; Licensed  */
'use strict';
var injector = (function (_) {
function Injector() {
    this.types = {};
    this.providers = {};
    this.fakes = {};
    this.state = {};
}

Injector.prototype.DEFAULT_LIFETIME = 'transient';

Injector.prototype.cache = {};

Injector.prototype.roots = {};

Injector.prototype.currentHashCode = 1;

Injector.prototype.strict_dependency_providers = true;

/* globals window: false */
/* exported lifetimes */
/* exported old_injector */
/* globals get_dependency_names*/

var lifetimes = ['singleton', 'transient', 'root', 'parent', 'state'];

var old_injector = window.injector;

Injector.prototype._build_anonymous_descriptor = function (name) { // for when inject is called with an anonymous function
    if (typeof name === 'function') {
        return {
            type: name,
            dependencies: get_dependency_names(name)
        };
    } else {
        return {
            type: name[name.length-1],
            dependencies: name.slice(0, name.length-1)
        };
    }
};

/*----------------------
 -- Injection Methods --
 ----------------------*/
function _assert_circular_references(template, dependencies, path) {
    var parent, name, parent_name;
    parent = template.parent;
    if (!parent) {
        return;
    }

    name = template.descriptor.name || template.descriptor.type;
    parent_name = parent.descriptor.name;
    path.unshift(name);

    var provider = parent.descriptor.provider;
    if (_.isArray(provider)) {
        provider = provider[provider.length - 1];
    }

    if (provider !== name && ~dependencies.indexOf(parent_name)) {
        throw 'Circular Reference Detected: ' +
            parent_name + ' -> ' +
            path.join(' -> ') +
            ' -> ' + parent_name;
    }
    _assert_circular_references(parent, dependencies, path);
}

var _is_parent = function (template, name) {
    if (!template) {
        return false;
    }
    if (template.children && template.children[name]) {
        return true;
    }
    return _is_parent(template.parent, name);
};

var _get_template = function (template, current_template) {
    return template.parent === current_template ? template : current_template || template;
};
Injector.prototype._inject = function (name, descriptor, parent, root) {
    var dependency_providers, template = {}, _this = this, provider_name;

    if (typeof name === 'string' && ~name.indexOf('::provider')) {
        name = name.replace('::provider', '');
        descriptor = this._get_descriptor(name);
        template.return_provider = true;
    }

    if (!descriptor) {
        if (parent) {
            return null;
        } else {
            throw 'There is no dependency named "' + name + '" registered.';
        }
    }

    template.hashCode = ++this.currentHashCode;
    template.descriptor = descriptor;
    template.parent = parent || null;
    template.root = root || template;
    name = descriptor.name;

    if (this.cache[name] && this.cache[name].hashCode === descriptor.hashCode) {
        return function (adhoc_dependencies, current_template) {
            var item = _this.cache[name] || _this.inject(name);
            if (template.return_provider) {
                return function (adhoc_dependencies) {
                    return item.call(this, adhoc_dependencies, _get_template(template, current_template));
                };
            }
            return item.call(this, adhoc_dependencies, _get_template(template, current_template));
        };
    }

    if (root && descriptor.dependencies) {
        _assert_circular_references(template, descriptor.dependencies, []);
    }

    root = template.root;

    provider_name = descriptor.provider;

    if (provider_name) {
        if (_.isArray(provider_name)) {
            provider_name = provider_name[provider_name.length - 1];
        }
        if (!parent || provider_name !== parent.descriptor[(typeof provider_name === 'string' ? 'name' : 'type')]) {
            var provider_descriptor = this._get_descriptor(descriptor.provider);
            provider_descriptor.dependencies.shift();
            provider_descriptor.dependencies.unshift(name);

            return this._inject(provider_name, provider_descriptor, template, root);
        }
    }

    dependency_providers = {};
    var counter = 0;
    _.each(descriptor.dependencies, _.bind(function (dependency_name) {
        var provider = this._inject(dependency_name, this._get_descriptor(dependency_name), template, root);
        if (dependency_providers[dependency_name]) {
            dependency_providers[dependency_name + counter++] = provider;
        } else {
            dependency_providers[dependency_name] = provider;
        }
    }, this));

    template.providers = dependency_providers;

    var provider = this._build_provider(template);
    provider.template = template;
    return function (adhoc_dependencies, current_template) {
        var item = provider.hashCode === _this._get_descriptor(name).hashCode ? provider : _this.inject(name);
        if (template.return_provider) {
            return function (adhoc_dependencies) {
                return item.call(this, adhoc_dependencies, _get_template(template, current_template));
            };
        }
        return item.call(this, adhoc_dependencies, _get_template(template, current_template));
    };
};

Injector.prototype._get_descriptor = function (name) {
    if (typeof name === 'string') {
        return this.fakes[name] || this.types[name] || this.providers[name];
    } else if (typeof name === 'undefined') {
        return {};
    }
    return this._build_anonymous_descriptor(name);
};

Injector.prototype.inject = function (name) {
    return this._inject(name, this._get_descriptor(name));
};

Injector.prototype.get = function (name, context, adhoc_dependencies) {
    var provider = this.inject(name);
    return context ? provider.call(context, adhoc_dependencies) : provider(adhoc_dependencies);
};

Injector.prototype.run = function (context, adhoc_dependencies) {
    if (!this.providers.main) {
        throw 'No main method registered. Please register one by running injector.registerMain() before running the app';
    }
    return this.get('main', context, adhoc_dependencies);
};

/* globals _: false */
/* globals window: false */
/* globals jasmine: false */


function map_dependencies(dependency_providers, adhoc_dependencies, current_template, injector_instance) {
    var _this = this;
    adhoc_dependencies = adhoc_dependencies || {};

    return _.map(dependency_providers, function (provider, key) {
        if (provider) {
            return provider.call(_this, adhoc_dependencies, current_template);
        } else if (adhoc_dependencies.hasOwnProperty(key)) {
            return adhoc_dependencies[key];
        } else if (injector_instance.strict_dependency_providers) {
            throw 'There is no dependency named "' + key + '" registered.';
        }
        return null;
    });
}

var create_object = Object.create;
Injector.prototype._provide_transient = function (current_template) {
    var type = current_template.descriptor.type,
        dependency_providers = current_template.providers,
        injector_instance = this;

    return function (adhoc_dependencies, current_template) {
        var instance = create_object(type.prototype);

        type.apply(instance, map_dependencies.call(this, dependency_providers, adhoc_dependencies, current_template, injector_instance));
        return instance;
    };
};
Injector.prototype._provide_cached = function (current_template, cache) {
    var name = current_template.descriptor.name;

    if (!cache[name]) {
        var dependency_to_cache = this._provide_transient(current_template);

        cache[name] = function (adhoc_dependencies) {
            var cached;
            if (typeof dependency_to_cache === 'function') {
                dependency_to_cache = dependency_to_cache.call(this, adhoc_dependencies);
                cached = function () {
                    return dependency_to_cache;
                };
                cached.hashCode = cache[name].hashCode;
                cache[name] = cached;
            }
            return dependency_to_cache;
        };
    }
    return cache[name];
};

Injector.prototype._provide_root = function (template) {
    var name = template.descriptor.name,
        _this = this;

    return function (adhoc_dependencies, current_template) {
        var roots = current_template.root.roots = current_template.root.roots || {};

        if (!roots[name]) {
            roots[name] = _this._provide_transient(template).call(this, adhoc_dependencies, current_template);
        }
        return roots[name];
    };
};

Injector.prototype._provide_provider = function(template) {
    var injector_instance = this;
    return function (adhoc_dependencies, current_template) {
        var dependencies = map_dependencies.call(this, template.providers, adhoc_dependencies, current_template, injector_instance);
        return template.descriptor.type.apply(this, dependencies);
    };
};

Injector.prototype._provide_parent = function (template) {
    var _this = this;

    return function (adhoc_dependencies, current_template) {
        var parent_template = current_template,
            topmost_parent = parent_template,
            dependency_name = template.descriptor.name;
        while (parent_template = parent_template.parent) {
            if (parent_template.children && parent_template.children[dependency_name]) {
                topmost_parent = parent_template;
                break;
            } else if (parent_template.descriptor.dependencies && ~parent_template.descriptor.dependencies.indexOf(dependency_name)) {
                topmost_parent = parent_template;
            }
        }

        parent_template = topmost_parent;

        parent_template.children = parent_template.children || {};


        if (!parent_template.children[dependency_name] || parent_template.children[dependency_name] === 'building') {
            parent_template.children[dependency_name] = 'building';
            parent_template.children[dependency_name] = _this._provide_transient(template).call(this, adhoc_dependencies, current_template);
        }
        return parent_template.children[dependency_name];
    };

};

(function () {
    var singletons = {};
    if (window['jasmine'] && jasmine.getEnv) {
        jasmine.getEnv().addReporter({
            specStarted: function () {
                singletons = {};
            }
        });
    }
    Injector.prototype._build_provider = function (current_template) {
        var item,
            descriptor = current_template.descriptor,
            name = descriptor.name,
            provider_name,
            cache = null;

        if (!descriptor.lifetime) {
            provider_name = 'provide_provider';
        } else {
            switch (descriptor.lifetime) {
                case 'singleton':
                    provider_name = 'provide_cached';
                    cache = singletons;
                    break;
                case 'state':
                    provider_name = 'provide_cached';
                    cache = this.state;
                    break;
                default:
                    provider_name = 'provide_' + descriptor.lifetime;
            }
        }
        item = this['_' + provider_name](current_template, cache);
        item.hashCode = descriptor.hashCode;
        if (name && !descriptor.provider) {
            this.cache[name] = item;
        }
        return item;
    };
}());

/* globals lifetimes: false */
/* globals get_dependency_names*/

function assertLifetime (lifetime) {
    if (!~lifetimes.indexOf(lifetime)) {
        throw 'invalid lifetime "' + lifetime + '" provided. Valid lifetimes are singleton, transient, instance and parent';
    }
}

Injector.prototype.registerType = function (name, type, lifetime, provider) {
    lifetime = lifetime || this.DEFAULT_LIFETIME;

    assertLifetime(lifetime);

    if (lifetime === 'singleton' && this.cache[name]) {
        throw 'you cannot re-register a singleton that has already been instantiated';
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

Injector.prototype.registerFake = function (name, type, lifetime, provider) {
    lifetime = lifetime || this.DEFAULT_LIFETIME;

    assertLifetime(lifetime);

    this._register('fakes', name, type, lifetime);

    if (provider) {
        this.fakes[name].provider = provider;
    }
};


Injector.prototype._register = function (where, name, type, lifetime) {
    var realType, dependencies, destination;

    if (!(where === 'types' || where === 'providers' || where === 'fakes')) {
        throw 'invalid destination "' + where + '" provided. Valid destinations are types, providers and fakes';
    }

    destination = this[where];

    if (typeof name !== 'string' || name === '') {
        throw 'Type must have a name';
    }

    if (!type) {
        throw 'no type was passed';
    } else if (typeof type === 'function') {
        dependencies = type.$inject || type.prototype.$inject || get_dependency_names(type);
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

    if (this.cache[name]) {
        delete this.cache[name];
    }
    destination[name] = {
        name: name,
        type: realType,
        dependencies: dependencies,
        lifetime: lifetime,
        hashCode: this.currentHashCode++
    };
};

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
    if (!parent_type) {
        throw 'No type "' + parent + '" found.';
    } else if (parent_type.lifetime !== 'transient') {
        throw 'Only transient lifetime types are allowed for now';
    } else {
        child.prototype = this.get(parent);
    }
};

Injector.prototype.noConflict = function () {
    window.injector = old_injector;
};

/*-------------------
 -- State Lifetime --
 -------------------*/

Injector.prototype.clearState = function () {
    var _this = this;

    _.each(this.state, function (provider, key) {
        if (_this.cache[key]) {
            delete _this.cache[key];
        }
    });
    this.state = {};
};

var injector = new Injector();

if (window.angular && angular.module) {
    angular.module('injectJS', []).factory('$injectJS', [function () { return injector; }]).run(['$rootScope', '$injectJS', function ($rootScope, $injectJS) {
        $rootScope.$on('$locationChangeStart', function () {
            $injectJS.clearState();
        });
        $injectJS.removeDefaultListener();
    }]);
}

var listener = function () {
    injector.clearState();
};

window.addEventListener('hashchange', listener);

Injector.prototype.removeDefaultListener = function () {
    window.removeEventListener('hashchange', listener);
};

return injector;
}(_));