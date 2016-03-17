/* globals Injector: false */
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
Injector.prototype._inject = function (name, parent) {
    var descriptor, dependency_providers;
    if (typeof name === 'string') {
        descriptor = this.fakes[name] || this.types[name] || this.providers[name];
        if (this.cache[name] && this.cache[name].hashCode === descriptor.hashCode) {
            return this.cache[name];
        }

    } else {
        descriptor = this.build_anonymous_descriptor(name);
    }

    if (!descriptor) {
        if (parent) {
            return null;
        } else {
            throw 'There is no dependency named "' + name + '" registered.';
        }
    }
    if (descriptor.provider && descriptor.provider !== parent) {
        return this._inject(descriptor.provider, name);
    }

    dependency_providers = {};
    _.each(descriptor.dependencies, _.bind(function (dependency_name) {
        dependency_providers[dependency_name] = this._inject(dependency_name, name);
    }, this));

    return this.build_provider(name, descriptor, dependency_providers);
};

Injector.prototype.inject = function (name) {
    return this._inject(name);
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
