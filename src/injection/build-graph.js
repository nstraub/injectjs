import _ from 'lodash';
import {uuid} from '../util';

import {assertCircularReferences, buildGraph, getDescriptor} from './index';

export default function (injector, name, descriptor, parent, root) {
    var template = {}, provider_name, dependency_templates;

    if (typeof name === 'string' && ~name.indexOf('::provider')) {
        name = name.replace('::provider', '');
        descriptor = getDescriptor(injector, name);
        template.return_provider = true;
    }

    if (!descriptor) {
        if (parent) {
            return null;
        } else {
            throw 'There is no dependency named "' + name + '" registered.';
        }
    }

    template.hashCode = uuid.getNext();
    template.descriptor = descriptor;
    template.parent = parent || null;
    template.root = root || template;

    if (root && descriptor.dependencies) {
        assertCircularReferences(template, descriptor.dependencies, []);
    }

    provider_name = descriptor.provider;

    if (provider_name) {
        if (_.isArray(provider_name)) {
            provider_name = provider_name[provider_name.length - 1];
        }
        if (!parent || provider_name !== parent.descriptor[(typeof provider_name === 'string' ? 'name' : 'type')]) {
            var provider_descriptor = getDescriptor(injector, descriptor.provider);
            provider_descriptor.dependencies.shift();
            provider_descriptor.dependencies.unshift(name);

            return buildGraph(injector, provider_name, provider_descriptor, parent, template.root);
        }
    }

    dependency_templates = {};
    var counter = 0;
    _.each(descriptor.dependencies, function (dependency_name) {
        var dependency_template = buildGraph(injector, dependency_name, getDescriptor(injector, dependency_name), template, template.root);
        if (dependency_templates[dependency_name]) {
            dependency_templates[dependency_name + counter++] = dependency_template;
        } else {
            dependency_templates[dependency_name] = dependency_template;
        }
    });

    template.dependencies = dependency_templates;
    return template;

};
