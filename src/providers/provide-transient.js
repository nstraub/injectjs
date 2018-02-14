import {provideProvider} from './index';
import uuid              from '../util/uuid';
import {buildGraph}      from '../injection';
import {cleanup}         from './provide-provider';


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
            const context = this;
            const instance = create_object(type.prototype);
            type.apply(instance, spec.dependencies.map(function (dep) {return dep.provider.call(context);}));
            return instance;
        };
    }
    if (descriptor.provider !== undefined) {
        descriptor.provider.dependencies.shift();
        let providerSpec = provideProvider(descriptor.provider, ...args);
        providerSpec.dependencies.unshift(spec);
        return providerSpec;
    }
    if (args[args.length-1]) {
        const provider = spec.provider;
        spec.provider = function () {
            let instance = provider.call(this);
            cleanup(spec);
            return instance;
        };
    }
    return spec;
}
