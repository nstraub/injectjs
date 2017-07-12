/*exported InjectJS */
import getProviderBuilder from './providers/provider.builder';
export default function (stores) {
    stores = stores || {};
    stores.providers = stores.providers || {};
    return {
        bind: function (dependency_name) {
            if (typeof dependency_name !== 'string') {
                throw new TypeError('you must supply a name for your dependency');
            }
            return stores.providers[dependency_name] = Object.create(getProviderBuilder());
        }
    }
};