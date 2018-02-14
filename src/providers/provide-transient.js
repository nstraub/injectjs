import {provideProvider} from './index';
import uuid              from '../util/uuid';
import {buildGraph}      from '../injection';
import {cleanup}         from './provide-provider';


const create_object = Object.create;

export default function (descriptor, ...args) {
    let spec, getProvider=false;
    const type = descriptor.type;
    let providerSpec;
    if (descriptor.name.indexOf('::provider')> -1) {
        getProvider=true;
        descriptor.name = descriptor.name.split('::provider')[0];
    }
    if (descriptor.dependencies === undefined) {
        spec = {
            id: uuid.getNext(),
            provider: function () {
                const instance = new type();
                if (providerSpec) {
                    return providerSpec.provider.call(this, {instance});
                }
                return instance;
            },
            descriptor
        };
    } else {
        spec = buildGraph(descriptor, ...args);
        spec.provider = function (adhocs) {
            const context = this;
            const instance = create_object(type.prototype);
            type.apply(instance, spec.dependencies.map(function (dep) {return dep.provider.call(context, adhocs);}));
            if (providerSpec) {
                return providerSpec.provider.call(context, {instance});
            }
            return instance;
        };
    }
    if (descriptor.provider !== undefined) {
        providerSpec = provideProvider(descriptor.provider, ...args);
        providerSpec.dependencies.unshift({
            id: uuid.getNext(),
            parent: providerSpec,
            root: providerSpec.root,
            provider: function (adhocs) {return adhocs.instance;}
        });
    }
    if (args.length <= 1 || getProvider) {
        const provider = spec.provider;
        spec.provider = function (adhocs) {
            let instance = provider.call(this, adhocs);
            cleanup(spec);
            return instance;
        };
    }
    if (getProvider) {
        const provider = spec.provider;
        spec.provider = function () {
            return provider;
        };
    }
    return spec;
}
