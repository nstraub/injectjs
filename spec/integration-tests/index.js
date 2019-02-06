import "babel-polyfill";
require('phantomjs-polyfill-array-from');
import setup                                                                  from './_setup/inject.spec.setup';

import {
    lifetimes_parent_spec, lifetimes_root_spec, lifetimes_singleton_spec, lifetimes_state_spec,
    lifetimes_transient_spec
}                                                                             from './Lifetimes';
import {caching_injection_spec}                    from './Caching';
import {
    circular_reference_spec, injection_get_spec, injection_inject_providers_spec,
    injection_inject_types_spec, injection_run_spec
}                                                                             from './Injection';
import 'jasmine-sinon';
import instanceOfMatcher from '../../spec/_common/instance-of-matcher'
export default function () {
    beforeAll(instanceOfMatcher);


    describe('injection', function () {
        describe('circular references', circular_reference_spec);
        describe('get', injection_get_spec);

        describe('inject', injection_inject_types_spec);

        describe('providers', injection_inject_providers_spec);

        return describe('run', injection_run_spec);
    });

    describe('lifetime', function () {
        beforeAll(function () {
            setup.assign_base_types();
            return setup.assign_basic_dependent_types();
        });

        describe('singleton', lifetimes_singleton_spec);

        describe('state', lifetimes_state_spec);

        describe('transient', lifetimes_transient_spec);

        describe('root', lifetimes_root_spec);

        return describe('parent', lifetimes_parent_spec);
    });
    describe('caching', function () {
        describe('injection', caching_injection_spec);
    });
}
