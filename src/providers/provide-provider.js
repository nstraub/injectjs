import {buildGraph}      from 'injection';


export default function (descriptor, ...args) {
    let spec = buildGraph(descriptor, ...args);
    spec.provider = function () {
        if (spec.dependencySpecs) {
            return spec.descriptor.type.apply(undefined, spec.dependencySpecs.map((dep)=> dep.provider()));
        }
        return spec.descriptor.type();
    };
    return spec;
}
