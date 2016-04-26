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
    if (!current_template) {
        return template;
    }
    if (template.parent) {
        return (template.parent.descriptor.provider && template.parent.parent) || template.parent === current_template ? template : current_template
    }
    // return template.parent === current_template || (template.parent.descriptor.provider && template.parent.parent === current_template)? template : current_template || template;
};
Injector.prototype._get_dependency_providers = function (descriptor, template, root) {
    var dependency_providers = {};
    var counter = 0;
    _.each(descriptor.dependencies, _.bind(function (dependency_name) {
        var provider = this._inject(dependency_name, this._get_descriptor(dependency_name), template, root);
        if (dependency_providers[dependency_name]) {
            dependency_providers[dependency_name + counter++] = provider;
        } else {
            dependency_providers[dependency_name] = provider;
        }
    }, this));
    return dependency_providers;
};
Injector.prototype._inject = function (graph) {
    /*var template = {}, _this = this, provider_name;

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
        if (template === template.root || this.cache[name].template.root !== template.root) {
            template.providers = _this._get_dependency_providers(descriptor, template, template.root)
        }
        return function (adhoc_dependencies, current_template) {
            var item = _this.cache[name] || _this.inject(name);
            if (template.return_provider) {
                return function (adhoc_dependencies) {
                    return item.call(this, adhoc_dependencies, template);
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

    template.providers = this._get_dependency_providers(descriptor, template, root);

    var provider = this._build_provider(descriptor);
    provider.template = template;
    return function (adhoc_dependencies, current_template) {
        var item = provider.hashCode === _this._get_descriptor(name).hashCode ? provider : _this.inject(name);
        if (template.return_provider) {
            return function (adhoc_dependencies) {
                return item.call(this, adhoc_dependencies, template);
            };
        }
        return item.call(this, adhoc_dependencies, _get_template(template, current_template));
    };*/
    if (!graph || !graph.provider) {
        return null;
    }
    var provider = this.providers[graph.provider];
    provider.dependencies = _.map(graph.dependencies, _.bind(this._inject, this));
    return function (adhoc_dependencies, context) {
        return provider.call(context, graph, adhoc_dependencies);
    }
};

Injector.prototype._get_descriptor = function (name) {
    if (typeof name === 'string') {
        return this.fakes[name] || this.types[name] || this.providers[name];
    }
    return null;
};

Injector.prototype._build_providers = function (name) {
    if (name && typeof this.providers[name] === 'undefined') {
        var descriptor = this._get_descriptor(name);
        var provider = this._build_provider(descriptor);

        this.providers[name] = provider;
        for (var key in descriptor.dependencies) {
            if (descriptor.dependencies.hasOwnProperty(key)) {
                this._build_providers(descriptor.dependencies[key]);
            }
        }
    }
};

Injector.prototype.link_descriptors = function (descriptor) {
    if (!descriptor.linked) {
        descriptor.dependencies = _.map(descriptor.dependencies, _.bind(this._get_descriptor, this));
        _.each(_.filter(descriptor.dependencies, function (dependency) {
            return !!dependency;
        }), _.bind(this.link_descriptors, this));
        descriptor.linked = true;
    }
};

Injector.prototype.build_dependency_graph = function (descriptor, parent, root) {
    var template = {};
    template.parent = parent;
    template.root = root || template;
    template.id = injector.currentHashCode++;
    template.lifetime = 'ad-hoc';

    if (descriptor) {
        template.lifetime = descriptor.lifetime;
        template.provider = descriptor.name;
        template.dependencies = _.map(descriptor.dependencies, _.bind(function (dependency) {
            return this.build_dependency_graph(dependency, template, template.root)
        }, this));
    }
    return template;
};
Injector.prototype.inject = function (name) {
    this._build_providers(name);
    var descriptor, graph;
    descriptor = this._get_descriptor(name);
    this.link_descriptors(descriptor);
    graph = this.build_dependency_graph(descriptor);

    return this._inject(graph);
};

Injector.prototype.get = function (name, adhoc_dependencies, context) {
    var provider = this.inject(name);
    return provider(adhoc_dependencies, context);
};

Injector.prototype.run = function (context, adhoc_dependencies) {
    if (!this.providers.main) {
        throw 'No main method registered. Please register one by running injector.registerMain() before running the app';
    }
    return this.get('main', context, adhoc_dependencies);
};
