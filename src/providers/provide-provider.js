import {uuid}       from '../util';


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
