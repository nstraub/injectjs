import {get_dependency_names} from '../inject.util';
import {
    assertDestinationIsCorrect,
    assertNameRequired, assertRealTypeWasPassed, assertTypeDependencyIntegrity, assertTypeRequired
}                             from './assertions';
import uuid                   from '../util/uuid';


function clearCache(injector, name) {
    if (injector.cache[name]) {
        delete injector.cache[name];
    }
}

export default function (injector, where, name, type, lifetime) {
    let realType, dependencies, destination;
    assertDestinationIsCorrect(where);

    destination = injector[where];
    assertNameRequired(name);

    assertTypeRequired(type);

    if (typeof type === 'function') {
        dependencies = type.$inject || type.prototype.$inject || get_dependency_names(type);
        realType = type;
    } else if (Array.isArray(type)) {
        realType = type[type.length - 1];

        assertTypeDependencyIntegrity(type, realType);

        dependencies = type.slice(0, type.length - 1);
    } else {
        throw 'type must be a function or an array';
    }
    assertRealTypeWasPassed(realType);
    clearCache(injector, name);
    destination[name] = {
        name: name,
        type: realType,
        dependencies: dependencies,
        lifetime: lifetime,
        hashCode: uuid.getNext()
    };
}
