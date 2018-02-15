import {buildGraph}      from '../injection';
import {provideProvider} from './index';
import uuid              from '../util/uuid';
import {identity}        from 'ramda';
import {cleanup}         from './provide-provider';



const identityf = function (a) {
    return function () {
        return identity(a);
    };
};
const create_object = Object.create;

export default function (descriptor, ...args) {
    const factory = function (spec) {
        let template;

        const type = descriptor.type;

        template = {
            id: uuid.getNext(),
            descriptor
        };

        if (descriptor.dependencies === undefined) {
            template.provider = function () {
                return new type();
            };
        } else {
            template.spec = spec;
            template.provider = function (adhocs) {
                const context = this;
                const instance = create_object(type.prototype);
                type.apply(instance, template.spec.dependencies.map(function (dep) {
                    return dep.provider.call(context, adhocs);
                }));
                return instance;
            };
        }
        if (descriptor.provider !== undefined) {
            template.passiveProvider =
                provideProvider(descriptor.provider, ...args)(buildGraph(descriptor.provider, args[0], spec.parent, spec.root));
            template.passiveProvider.spec.dependencies.unshift({
                provider: function (adhocs) {
                    return adhocs.instance;
                }
            });
            let provider = template.provider;
            template.provider = function (adhocs) {
                let context = this;
                return template.passiveProvider.provider.call(context, {instance: provider.call(context, adhocs)});
            };
        }

        if (args.length <= 1 || descriptor.name.indexOf('::provider') > -1) {
            let provider = template.provider;
            template.provider = function (adhoc) {
                const instance = provider.call(this, adhoc);
                cleanup(spec);
                return instance;
            };
        }

        if (descriptor.name.indexOf('::provider') > -1) {
            template.provider = identityf(template.provider);
        }

        return template;
    };
    factory.descriptor = descriptor;
    return factory;
}
