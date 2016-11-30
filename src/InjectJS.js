/*exported InjectJS */
var InjectJS = (function (stores) {
    'use strict';
    stores = stores || {};
    stores.providers = stores.providers || {};
    return {
        resolve: function (dependency_name) {
            if (typeof dependency_name !== 'string') {
                throw new TypeError('you must supply a name for your dependency');
            }
            return stores.providers[dependency_name] = Object.create(ProviderBuilder);
        }
    }
}(stores));