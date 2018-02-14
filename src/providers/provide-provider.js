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
    spec.provider = function (adhocs) {
        const context = this;
        if (spec.dependencies) {
            return spec.descriptor.type.apply(this, spec.dependencies.map(function (dep) {return dep.provider.call(context, adhocs);}));
        }
        return spec.descriptor.type.call(this);
    };
    if (args[args.length-1] === undefined) {
        const provider = spec.provider;
        spec.provider = function (adhocs) {
            let instance = provider.call(this, adhocs);
            cleanup(spec);
            return instance;
        };
    }
    return spec;
}
