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
