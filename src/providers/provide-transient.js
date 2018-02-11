import {mapDependencies} from './index';


const create_object = Object.create;
export default function (descriptor) {
    const type = descriptor.type;

    return function (graph, adhoc_dependencies) {
        const instance = create_object(type.prototype);
        type.apply(instance, mapDependencies(this, adhoc_dependencies, graph));
        return instance;
    };
}
