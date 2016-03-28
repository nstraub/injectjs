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
    var dependency_providers, template, _this = this;

    if (!descriptor) {
        if (parent) {
            return null;
        } else {
            throw 'There is no dependency named "' + name + '" registered.';
        }
    }

    name = descriptor.name;

    template = {};

    template.hashCode = ++this.currentHashCode;
    template.descriptor = descriptor;
    template.parent = parent || null;
    template.root = root || template;

    if (this.cache[name] && this.cache[name].hashCode === descriptor.hashCode) {
        return function (adhoc_dependencies, current_template) {
            return _this.cache[name](adhoc_dependencies, current_template || template);
        };
    }

    root = template.root;

    if (descriptor.provider && (!parent || descriptor.provider !== parent.descriptor.name)) {
        return this._inject(descriptor.provider, this.getDescriptor(descriptor.provider), template, root);
    }

    dependency_providers = {};
    var counter = 0;
    _.each(descriptor.dependencies, _.bind(function (dependency_name) {
        var provider = this._inject(dependency_name, this.getDescriptor(dependency_name), template, root);
        if (dependency_providers[dependency_name]) {
            dependency_providers[dependency_name + counter++] = provider;
        } else {
            dependency_providers[dependency_name] = provider;
        }
    }, this));

    template.providers = dependency_providers;

    return this.build_provider(template);
};

Injector.prototype.getDescriptor = function (name) {
    return typeof name === 'string' ? this.fakes[name] || this.types[name] || this.providers[name] : this.build_anonymous_descriptor(name);
};

Injector.prototype.inject = function (name) {
    return this._inject(name, this.getDescriptor(name));
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
