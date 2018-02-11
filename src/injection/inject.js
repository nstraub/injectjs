import _                                       from 'lodash';
import {getDescriptor, inject, providerGetter} from './index';


export default function (injector, template) {
    if (template === null) {
        return null;
    }
    var descriptor = template.descriptor;

    var name = descriptor.name, dependency_providers;

    dependency_providers = {};
    _.each(template.dependencies, _.bind(function (dependency_template, dependency_template_key) {
        dependency_providers[dependency_template_key] = inject(injector, dependency_template);
    }));

    template.providers = dependency_providers;

    if (injector.cache[name] && injector.cache[name].hashCode === descriptor.hashCode) {
        return providerGetter(_.bind(function () {return injector.cache[name] || injector.inject(template);}, injector), template);
    }

    var provider = injector._build_provider(template.descriptor);

    return providerGetter(_.bind(function () { return provider.hashCode === getDescriptor(injector, name).hashCode ? provider : injector.inject(template); }, injector), template);
};
