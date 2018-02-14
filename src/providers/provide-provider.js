import {buildGraph}      from 'injection';

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

export function cleanupDependencies(dependencies) {
    dependencies.forEach(cleanup);
}
export default function (descriptor, ...args) {
    let spec = buildGraph(descriptor, ...args);
    spec.provider = function () {
        const context = this;
        if (spec.dependencies) {
            return spec.descriptor.type.apply(this, spec.dependencies.map(function (dep) {return dep.provider.call(context);}));
        }
        return spec.descriptor.type.call(this);
    };
    if (args[args.length-1] === undefined) {
        const provider = spec.provider;
        spec.provider = function () {
            let instance = provider.call(this);
            cleanup(spec);
            return instance;
        };
    }
    return spec;
}
