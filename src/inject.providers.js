/* globals Injector: false */
/* globals _: false */
/* globals jasmine: false */

function map_dependencies(dependency_providers, adhoc_dependencies, current_template) {
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
        return provider.call(_this, adhoc_dependencies, current_template);
    });
}

var createObject = Object.create;
Injector.prototype.provide_transient = function (template) {
    var type = template.descriptor.type,
        dependency_providers = template.providers;

    return function (adhoc_dependencies, current_template) {
        var instance = createObject(type.prototype);

        type.apply(instance, map_dependencies.call(this, dependency_providers, adhoc_dependencies, current_template));
        return instance;
    };
};
Injector.prototype.provide_cached = function (template, cache) {
    var name = template.descriptor.name;

    if (!cache[name]) {
        var dependency_to_cache = this.provide_transient(template);
        cache[name] = function (adhoc_dependencies) {
            var cached;
            if (typeof dependency_to_cache === 'function') {
                dependency_to_cache = dependency_to_cache(adhoc_dependencies);
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

Injector.prototype.provide_root = function (template) {
    var name = template.descriptor.name,
        roots = template.root.roots = template.root.roots || {},
        _this = this;

    return function (adhoc_dependencies, current_template) {
        if (current_template) {
            roots = current_template.root.roots = current_template.root.roots || {};
        }
        if (!roots[name]) {
            roots[name] = _this.provide_transient(template)(adhoc_dependencies, current_template);
        }
        return roots[name];
    };
};

Injector.prototype.provide_provider = function(template) {
    return function (adhoc_dependencies, current_template) {
        var dependencies = map_dependencies.call(this, template.providers, adhoc_dependencies, current_template);
        return template.descriptor.type.apply(this, dependencies);
    };
};

Injector.prototype.provide_parent = function (template) {
    var _this = this;

    return function (adhoc_dependencies, current_template) {
        current_template = current_template || template;
        var parent_template = current_template,
            topmost_parent = parent_template;

        while (parent_template = parent_template.parent) {
            if (parent_template.children && parent_template.children[current_template.descriptor.name]) {
                topmost_parent = parent_template;
                break;
            } else if (parent_template.descriptor.dependencies && ~parent_template.descriptor.dependencies.indexOf(current_template.descriptor.name)) {
                topmost_parent = parent_template;
            }
        }

        parent_template = topmost_parent;

        parent_template.children = parent_template.children || {};

        var dependency_name = template.descriptor.name;
        if (!parent_template.children[dependency_name] || parent_template.children[dependency_name] === 'building') {
            parent_template.children[dependency_name] = 'building';
            parent_template.children[dependency_name] = _this.provide_transient(template)(adhoc_dependencies, template);
        }
        return parent_template.children[dependency_name];
    };

};

(function () {
    var singletons = {};
    if (jasmine && jasmine.getEnv) {
        jasmine.getEnv().addReporter({
            specStarted: function () {
                singletons = {};
            }
        });
    }
    Injector.prototype.build_provider = function (template) {
        var item,
            descriptor = template.descriptor,
            name = descriptor.name;

        if (!descriptor.lifetime) {
            item = this.provide_provider(template);
        } else {
            switch (descriptor.lifetime) {
                case 'singleton':
                    item = this.provide_cached(template, singletons);
                    break;
                case 'state':
                    item = this.provide_cached(template, this.state);
                    break;
                case 'root':
                    item = this.provide_root(template);
                    break;
                case 'parent':
                    item = this.provide_parent(template);
                    break;
                default:
                    item = this.provide_transient(template);
            }
        }
        if (name && !descriptor.provider) {
            item.hashCode = descriptor.hashCode;
            this.cache[descriptor.name] = item;
        }
        return item;
    };
}());
