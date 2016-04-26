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

Injector.prototype._build_graph = function (name, descriptor, parent, root) {
    var template = {}, provider_name, dependency_templates;

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

    if (root && descriptor.dependencies) {
        _assert_circular_references(template, descriptor.dependencies, []);
    }

    provider_name = descriptor.provider;

    if (provider_name) {
        if (_.isArray(provider_name)) {
            provider_name = provider_name[provider_name.length - 1];
        }
        if (!parent || provider_name !== parent.descriptor[(typeof provider_name === 'string' ? 'name' : 'type')]) {
            var provider_descriptor = this._get_descriptor(descriptor.provider);
            provider_descriptor.dependencies.shift();
            provider_descriptor.dependencies.unshift(name);

            return this._build_graph(provider_name, provider_descriptor, parent, template.root);
        }
    }

    dependency_templates = {};
    var counter = 0;
    _.each(descriptor.dependencies, _.bind(function (dependency_name) {
        var dependency_template = this._build_graph(dependency_name, this._get_descriptor(dependency_name), template, template.root);
        if (dependency_templates[dependency_name]) {
            dependency_templates[dependency_name + counter++] = dependency_template;
        } else {
            dependency_templates[dependency_name] = dependency_template;
        }
    }, this));

    template.dependencies = dependency_templates;
    return template;

};

function set_root(template, root) {
    template.root = root;
    _.each(template.dependencies, function (dependency) {
        set_root(dependency, root);
    });
}

Injector.prototype._provider_getter = function (item, template) {
    var _this = this;
    return function (adhoc_dependencies, template_clone) {
        var provider = item();
        if (template.return_provider) {
            return function (adhoc_dependencies) {
                var template_clone = _.cloneDeepWith(template, function(value, key) {
                    switch (key) {
                        case 'root': return value;
                        case 'children': return {};
                        case 'hashCode': return ++_this.currentHashCode;
                        default: return;
                    }
                });
                template_clone.parent = template.parent;
                if (template === template.root) {
                    set_root(template_clone, template_clone);
                    if (template_clone.roots) {
                        delete template_clone.roots;
                    }
                }
                return provider.call(this, template_clone, adhoc_dependencies);
            };
        }
        return provider.call(this, template_clone || template, adhoc_dependencies);
    };
};

Injector.prototype._inject = function (template) {
    if (template === null) {
        return null;
    }
    var descriptor = template.descriptor;

    var name = descriptor.name, dependency_providers;

    dependency_providers = {};
    _.each(template.dependencies, _.bind(function (dependency_template, dependency_template_key) {
        dependency_providers[dependency_template_key] = this._inject(dependency_template);
    }, this));

    template.providers = dependency_providers;

    if (this.cache[name] && this.cache[name].hashCode === descriptor.hashCode) {
        return this._provider_getter(_.bind(function () {return this.cache[name] || this.inject(template);}, this), template);
    }

    var provider = this._build_provider(template.descriptor);

    return this._provider_getter(_.bind(function () { return provider.hashCode === this._get_descriptor(name).hashCode ? provider : this.inject(template); }, this), template);
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
    return this._inject(this._build_graph(name, this._get_descriptor(name)));
};

Injector.prototype.get = function (name, adhoc_dependencies, context) {
    var provider = this.inject(name);
    return provider.call(context, adhoc_dependencies);
};

Injector.prototype.run = function (context, adhoc_dependencies) {
    if (!this.providers.main) {
        throw 'No main method registered. Please register one by running injector.registerMain() before running the app';
    }
    return this.get('main', context, adhoc_dependencies);
};
