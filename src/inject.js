/* globals Injector: false */
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

Injector.prototype._inject = function (name, descriptor, parent, root) {
    var dependency_providers, template, _this = this, provider_name;

    if (!descriptor) {
        if (parent) {
            return null;
        } else {
            throw 'There is no dependency named "' + name + '" registered.';
        }
    }

    template = {};

    template.hashCode = ++this.currentHashCode;
    template.descriptor = descriptor;
    template.parent = parent || null;
    template.root = root || template;
    name = descriptor.name;

    if (this.cache[name] && this.cache[name].hashCode === descriptor.hashCode) {
        return function (adhoc_dependencies, current_template) {
            var item = _this.cache[name] || _this.inject(name);
            return item.call(this, adhoc_dependencies, current_template || template);
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

    return this._build_provider(template);
};

Injector.prototype._get_descriptor = function (name) {
    return typeof name === 'string' ? this.fakes[name] || this.types[name] || this.providers[name] : this._build_anonymous_descriptor(name);
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
