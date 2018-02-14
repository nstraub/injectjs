import getDependencyNames from '../util/get-dependency-names';
import uuid               from '../util/uuid';

import {
    assertNameRequired, assertTypeProvided,
    assertTypeDependency, assertTypeRequired
} from './assertions';


// warning removed clearCache from this func. need to verify and clear during injection

export default function (name, typeDescriptor, lifetime) {
    let type, dependencies;

    assertNameRequired(name);

    assertTypeRequired(typeDescriptor);

    if (typeof typeDescriptor === 'function') {
        dependencies =
            typeDescriptor.$inject || typeDescriptor.prototype.$inject || getDependencyNames(typeDescriptor);
        type = typeDescriptor;
    } else if (Array.isArray(typeDescriptor)) {
        type = typeDescriptor[typeDescriptor.length - 1];

        assertTypeDependency(typeDescriptor, type);

        dependencies =
            typeDescriptor.length > 1 ?
                typeDescriptor.slice(0, typeDescriptor.length - 1) : undefined;
    } else {
        throw 'type must be a function or an array';
    }
    assertTypeProvided(type);

    return {
        name,
        type,
        dependencies,
        lifetime,
        hashCode: uuid.getNext()
    };
}
