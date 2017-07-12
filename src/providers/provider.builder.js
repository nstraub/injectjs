/* exported createProviderBuilderPrototype */
/*global _*/
function createProviderBuilderPrototype(stores, providers) {
    "use strict";
    return {
        with: function (dependency) {
            this._dependency = dependency;
            this._dependencyType = _.isFunction(dependency) ? 'ctor' : 'proto';
            if (this._post_provider) {
                this._post_provider._inject.unshift(dependency);
            }
        },

        withLifetime: function (lifetime_name) {
            if (!providers[lifetime_name]) {
                throw new ReferenceError("provider '" + lifetime_name + "' doesn't exist");
            }

            this._lifetime_provider = Object.create(providers[lifetime_name]);
            if (this._lifetime_provider._assert_usable) {
                this._lifetime_provider._assert_usable();
            }

            return this;
        },
        asTransient: function () { return this.withLifetime('transient'); },
        asSingleton: function () { return this.withLifetime('singleton'); },
        asState: function () { return this.withLifetime('state'); },
        asRoot: function () { return this.withLifetime('root'); },
        asParent: function () { return this.withLifetime('parent'); },

        withProvider: function () { throw 'not implemented'; },
        withPostProvider: function () { throw 'not implemented'; },

        dependsOn: function (dependencies) {
            if (!(dependencies instanceof Array)) {
                throw new TypeError("array expected. '" + dependencies + "' is not an array");
            }

            dependencies.forEach(function (dependency, index) {
                if (typeof dependency === 'string') {
                    dependencies[index] = {
                        name: dependency,
                        provider: stores.providers[dependency]
                    };
                } else if (!_.isPlainObject(dependency)) {
                    throw new TypeError('dependency at index ' + index + ' is ' + Object.prototype.toString.call(dependency) + '. it should be either a string or an object');
                }
                if (dependency.static) {
                    dependency.provider = stores.providers[dependency.name];
                    if (!dependency.provider) {
                        console.warn('static dependency ' + dependency.name + ' is not registered');
                    }
                }
            });
            this._inject = dependencies;
            return this;
        }
    };
}