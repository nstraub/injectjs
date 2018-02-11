import _ from 'lodash';

export const mode = {strict: true};
export default function (root_target, adhoc_dependencies, graph) {
    adhoc_dependencies = adhoc_dependencies || {};

    return _.map(graph.providers, function (provider, key) {
        if (provider) {
            return provider.call(root_target, adhoc_dependencies, graph.dependencies[key]);
        } else if (adhoc_dependencies.hasOwnProperty(key)) {
            return adhoc_dependencies[key];
        } else if (mode.strict) {
            throw 'There is no dependency named "' + key + '" registered.';
        }
        return null;
    });
}
