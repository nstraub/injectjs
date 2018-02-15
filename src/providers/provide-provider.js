import {uuid}       from '../util';

export function cleanup(spec) {
    if (spec.roots !==undefined) {
        delete spec.roots;
    }
    delete spec.root;
    delete spec.parent;
    if (spec.children !== undefined) {
        delete spec.children;
    }
    if (spec.dependencies) {
        cleanupDependencies(spec.dependencies);
    }
}

function cleanupDependencies(dependencies) {
    dependencies.forEach(cleanup);
}

export default function (descriptor) {
    const factory = function (spec) {
        return {
            id: uuid.getNext(),
            descriptor,
            spec,
            provider: function (adhocs) {
                const context = this;
                if (spec.dependencies) {
                    return spec.descriptor.type.apply(this, spec.dependencies.map(function (dep) {
                        return dep.provider.call(context, adhocs);
                    }));
                }
                return spec.descriptor.type.call(this);
            }
        };
    };

    factory.descriptor = descriptor;
    return factory;
}
