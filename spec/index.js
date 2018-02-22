import 'babel-polyfill';
require('jasmine-sinon');
import instanceOfMatcher from './_common/instance-of-matcher';

import {
    assertions_spec, assertLifetime_spec, register_spec,
    registerType_spec, registerInstantiable_spec, registerProvider_spec
} from './registration';
import {clearState_spec, getDependencyNamesSpec, uuidSpec} from './util';
import {
    buildProvider_spec, provideCached_spec, provideParent_spec,
    provideProvider_spec,
    provideRoot_spec,
    provideTransient_spec
}                                                          from './providers';
import {
    assertCircularReferences_spec, buildGraph_spec, getDescriptor_spec
}                                                          from './injection';

describe('InjectJS', function () {
    beforeAll(instanceOfMatcher);
    describe('Registration', function () {
        describe('Assert Lifetime', assertLifetime_spec);
        describe('Assertions', assertions_spec);
        describe('Register Type', registerType_spec);
        describe('Register Instantiable', registerInstantiable_spec);
        describe('Register', register_spec);
        describe('Register Provider', registerProvider_spec);
    });

    describe('Utilities', function () {
        describe('uuid', uuidSpec);
        describe('Get Dependency Names', getDependencyNamesSpec);
        describe('Clear State', clearState_spec);
    });

    describe('Providers', function () {
        describe('Build Provider', buildProvider_spec);

        describe('Transient Provider', provideTransient_spec);
        describe('Provider Provider', provideProvider_spec);
        describe('Cached Provider', provideCached_spec);
        describe('Root Provider', provideRoot_spec);
        describe('Parent Provider', provideParent_spec);
    });

    describe('Injection', function () {
        describe('Build Graph', buildGraph_spec);
        describe('Get Descriptor', getDescriptor_spec);
        describe('Assert Circular References', assertCircularReferences_spec);
    });
});
