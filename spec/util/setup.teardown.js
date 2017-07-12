/*global createProviderBuilderPrototype*/
/*global createProviderProxyPrototype*/
/*global jasmine*/

import createProviderBuilderPrototype from '../../src/providers/provider.builder'
import createProviderProxyPrototype from '../../src/providers/provider.proxy'
import InjectJSFactory from '../../src/InjectJS';

const stores = Object.create(null),
    providers = {},
    ProviderBuilder = createProviderBuilderPrototype(stores, providers),
    ProviderProxy = createProviderProxyPrototype(stores, providers),
    InjectJS = InjectJSFactory(stores),
    global_setup = function () {

        jasmine.addMatchers({
            toBeInstanceOf: function () {
                return {
                    compare: function (actual, expected) {
                        return {
                            message: function () {
                                return "Expected " + actual.constructor.name + " is instance of " + expected.name;
                            },
                            pass: expected.isPrototypeOf(actual)
                        };
                    }
                };

            }
        });
    },
    local_teardown = function () {
        for (let key in stores) {
            stores[key] = {};
        }
    };

export {global_setup, local_teardown, stores, providers, ProviderBuilder, ProviderProxy, InjectJS};