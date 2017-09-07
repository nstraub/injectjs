import _isFunction from 'lodash.isfunction';
import _isPlainObject from 'lodash.isplainobject';
import InvalidOperationError from '../../src/util/invalid-operation-error';
import getProviderProxy from '../../src/providers/provider.proxy';

function createProviderBuilderPrototype(stores, providers) {
    return {
        to: function (dependency) {
            if (this._dependency) {
                throw new InvalidOperationError('This interface is already bound to a type');
            }
            if (!(_isFunction(dependency) || _isPlainObject(dependency))) {
                throw new TypeError(`Object or Function expected. '${dependency}' is neither`);
            }
            this._dependency = dependency;
            this._dependencyType = _isFunction(dependency) ? 'ctor' : 'proto';
            if (this._post_provider) {
                this._post_provider._inject.unshift(dependency);
            }
            return this;
        },

        withLifetime: function (lifetime_name) {
            if (!providers[lifetime_name]) {
                throw new ReferenceError('provider \'' + lifetime_name + '\' doesn\'t exist');
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

        toProvider: function (provider) {
            let ProviderProxy = getProviderProxy();
            if (this._dependency) {
                throw new InvalidOperationError('This interface is already bound to a type');
            }
            if (!_isFunction(provider)) {
                throw new TypeError(`function expected. '${provider}' is not a function`);
            }
            this._dependency = Object.create(ProviderProxy);
            this._dependency.$get = provider;
            this._dependencyType = 'provider';
            return this;
        },

        withPostProvider: function (provider) {
            let ProviderProxy = getProviderProxy();

            if (!(ProviderProxy.isPrototypeOf(provider) || _isFunction(provider))) {
                throw new TypeError(`ProviderProxy instance or Function expected. '${provider}' is neither`);
            }
            if (ProviderProxy.isPrototypeOf(provider)) {
                this._post_provider = provider;
            } else {
                this._post_provider = Object.create(ProviderProxy);
                this._post_provider.$get = provider;
            }
            this._post_provider._inject = this._inject;
            return this;
        },

        dependsOn: function (dependencies) {
            if (!(dependencies instanceof Array)) {
                throw new TypeError('array expected. \'' + dependencies + '\' is not an array');
            }

            dependencies.forEach(function (dependency, index) {
                if (typeof dependency === 'string') {
                    dependencies[index] = {
                        name: dependency,
                        provider: stores.providers[dependency]
                    };
                } else if (!_isPlainObject(dependency)) {
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

let ProviderBuilder = null;

export default function (stores, providers) {
    if (!ProviderBuilder) {
        ProviderBuilder = createProviderBuilderPrototype(stores, providers);
    }

    return ProviderBuilder;
}