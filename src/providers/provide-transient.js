import {provideProvider} from './index';
import uuid                               from '../util/uuid';
import {buildGraph}                       from '../injection';


const create_object = Object.create;
export default function (descriptor, ...args) {
    let spec;
    const type = descriptor.type;
    if (descriptor.dependencies === undefined) {
        spec = {
            id: uuid.getNext(),
            provider: () => new type(),
            descriptor
        };
    } else {
        spec = buildGraph(descriptor, ...args);
        spec.provider = function () {
            const instance = create_object(type.prototype);
            type.apply(instance, spec.dependencySpecs.map(spec => spec.provider()));
            return instance;
        };
    }
    if (descriptor.provider !== undefined) {
        let providerSpec = provideProvider(descriptor.provider);
        providerSpec.dependencySpecs.unshift(spec);
        return providerSpec;
    }
    return spec;
}
