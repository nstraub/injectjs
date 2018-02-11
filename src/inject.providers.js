import Injector                   from './inject.constructor';
import * as providers                           from './providers';
import {lensIndex, over, toUpper, join, compose} from 'ramda';

(function () {
    var singletons = {};
    if (window['jasmine'] && jasmine.getEnv) {
        jasmine.getEnv().addReporter({
            specStarted: function () {
                singletons = {};
            }
        });
    }
    const toTitle = compose(
        join(''),
        over(lensIndex(0), toUpper)
    );
    Injector.prototype._build_provider = function (descriptor) {
        var item,
            name = descriptor.name,
            provider_name,
            cache = null;

        if (!descriptor.lifetime) {
            provider_name = 'provideProvider';
        } else {
            switch (descriptor.lifetime) {
            case 'singleton':
                provider_name = 'provideCached';
                cache = singletons;
                break;
            case 'state':
                provider_name = 'provideCached';
                cache = this.state;
                break;
            default:
                provider_name = 'provide' + toTitle(descriptor.lifetime);
            }
        }
        item = providers[provider_name](descriptor, cache);
        item.hashCode = descriptor.hashCode;
        if (name && !descriptor.provider) {
            this.cache[name] = item;
        }
        return item;
    };
}());
