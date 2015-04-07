'use strict';
var injector = (function (providers, registration) {
    var lifetimes = ['singleton', 'transient', 'root', 'parent', 'state'],
        injector;

    // Cleanup globals
    // Todo implement grunt build to avoid globals.
    providers.noConflict();
    registration.noConflict();

    function Injector() {
        this.types = {};
        this.providers = {};
        this.fakes = {};
        this.cache = {};
        this.state = {};
    }

    var old_injector = window.injector;

    /*-------------------------
     -- Registration Methods --
     -------------------------*/

    Injector.prototype.registerType = function (name, type, lifetime, provider) {
        lifetime = lifetime || 'transient';

        if (lifetimes.indexOf(lifetime) === -1) {
            throw 'invalid lifetime "' + lifetime + '" provided. Valid lifetimes are singleton, transient, instance and parent'
        }

        registration._register.call(this,'types', name, type, lifetime);

        if (provider) {
            this.types[name].provider = provider;
        }
    };

    Injector.prototype.registerProvider = function (name, provider) {
        registration._register.call(this,'providers', name, provider);
    };

    Injector.prototype.registerMain = function (main) {
        registration._register.call(this,'providers', 'main', main);
    };

    Injector.prototype.registerFake = function (name, type, lifetime) {
        lifetime = lifetime || 'transient';

        if (lifetimes.indexOf(lifetime) === -1) {
            throw 'invalid lifetime "' + lifetime + '" provided. Valid lifetimes are singleton, transient, instance and parent'
        }

        registration._register.call(this,'fakes', name, type, lifetime);
    };

    /*----------------------
     -- Injection Methods --
     ----------------------*/
    function _inject (name, parent) {
        var descriptor, type, dependency_providers, is_provider, provider;
        if (typeof name === 'string') {
            if (this.cache[name]) {
                return this.cache[name];
            }
            descriptor = this.fakes[name] || this.types[name] || this.providers[name];
            is_provider = !!this.providers[name];

        } else {
            descriptor = registration.build_anonymous_descriptor(name);
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
            dependency_providers[dependency_name] = _inject.call(this, dependency_name, name);
        }, this);


        if (is_provider) {
            provider = providers.provide_provider(dependency_providers, type);

            if (typeof name === 'string') {
                this.cache[name] = provider;
            }

            return provider;
        } else {
            if (descriptor.provider && descriptor.provider !== parent) {
                return this.cache[name] = _inject.call(this, descriptor.provider, name);
            }
            return this.cache[name] = providers.build_provider(name, descriptor, dependency_providers, this.state);
        }
    }

    Injector.prototype.inject = function (name) {
        return _inject.call(this, name);
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
        return injector.get('main', context, adhoc_dependencies);
    };

    /*--------------------
     -- Testing Methods --
     --------------------*/

    Injector.prototype.harness = function (func) {
        var _this = this;
        return function (adhoc_dependencies) {
            return _this.inject(func)(adhoc_dependencies);
        }
    };

    Injector.prototype.removeFake = function (name) {
        delete this.fakes[name];
    };

    Injector.prototype.flushFakes = function () {
        this.fakes = {};
    };

    /*--------------------
     -- Utility Methods --
     --------------------*/

    Injector.prototype.getType = function (name) {
        var type = this.fakes[name] || this.types[name];

        if (type) {
            return type.type;
        }
        return null
    };

    Injector.prototype.extend = function (parent, child) {
        var parent_type = injector.types[parent];
        if (parent_type) {
            child.prototype = this.get(parent);
        } else {
            throw 'No type "' + parent + '" found.'
        }
    };

    function listener() {
        injector.clearState();
    };

    Injector.prototype.noConflict = function () {
        window.injector = old_injector;
    };

    Injector.prototype.hide = function () {
        window.removeEventListener('hashchange', listener)
    };

    /*-------------------
     -- State Lifetime --
     -------------------*/

    Injector.prototype.clearState = function () {
        this.state = {};
        _.each(this.types, function (descriptor, key) {
            if (descriptor.lifetime === 'state') {
                delete this.cache[key];
            }
        }, this);
    };

    injector = new Injector();

    //Todo implement so this is de-registered if another form of state change is bound
    window.addEventListener('hashchange', listener);

    return injector;
})(providers, registration);
