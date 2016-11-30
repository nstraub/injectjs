/*global createProviderBuilderPrototype*/
/*global createProviderProxyPrototype*/
/*global jasmine*/

var stores = Object.create(null),
    providers = {},
    ProviderBuilder,
    ProviderProxy,
    global_setup = function () {
        "use strict";
        ProviderBuilder = createProviderBuilderPrototype(stores, providers);
        ProviderProxy = createProviderProxyPrototype(stores, providers);

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
        "use strict";
        var key;
        for (key in stores) {
            stores[key] = {};
        }
    };

