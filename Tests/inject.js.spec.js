import "babel-polyfill";
require('phantomjs-polyfill-array-from')
import {
    registration_register_fake_spec, registration_register_main_spec, registration_register_provider_spec,
    registration_register_spec, registration_register_type_spec
}                                                                             from './Registration';
import setup                                                                  from './_setup/inject.spec.setup';
import {utility_extend_spec, utility_get_type_spec} from './Utility';
import {
    lifetimes_parent_spec, lifetimes_root_spec, lifetimes_singleton_spec, lifetimes_state_spec,
    lifetimes_transient_spec
}                                                                             from './Lifetimes';
import {fakes_flush_fakes_spec, fakes_remove_fake_spec}                       from './Fakes';
import {caching_injection_spec, caching_registration_spec}                    from './Caching';
import {
    circular_reference_spec, injection_get_spec, injection_harness_spec, injection_inject_providers_spec,
    injection_inject_types_spec, injection_run_spec
}                                                                             from './Injection';
import 'jasmine-sinon';

describe('injector', function () {
    beforeAll(function () {
        jasmine.addMatchers({
            toBeInstanceOf() {
                return {
                    compare(actual, expected) {
                        let result = undefined;
                        result =
                            {pass: actual instanceof expected};
                        if (result.pass) {
                            result.message = `Expected ${actual} not to be an instance of ${expected}`;
                        } else {
                            result.message = `Expected ${actual} to be an instance of ${expected}`;
                        }
                        return result;
                    }
                };
            }
        });
    });

    describe('registration', function () {
        beforeEach(function () {
            this.test_type = function () {
            };
            this.test_result = {
                hashCode: 1,
                name: 'test type',
                type: this.test_type,
                dependencies: null,
                lifetime: 'transient'
            };
        });

        describe('register', registration_register_spec);

        describe('registerType', registration_register_type_spec);

        describe('registerProvider', registration_register_provider_spec);

        describe('register main', registration_register_main_spec);

        return describe('registerFake', registration_register_fake_spec);
    });


    describe('getType', utility_get_type_spec);

    describe('extend', utility_extend_spec);

    describe('injection', function () {
        describe('circular references', circular_reference_spec);
        describe('get', injection_get_spec);

        describe('inject', injection_inject_types_spec);

        describe('providers', injection_inject_providers_spec);

        describe('harness', injection_harness_spec);

        return describe('run', injection_run_spec);
    });

    describe('lifetime', function () {
        beforeAll(function () {
            setup.reset_injector();
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
        return describe('registration', caching_registration_spec);
    });

    return describe('fakes', function () {
        describe('flushFakes', fakes_flush_fakes_spec);
        return describe('removeFake', fakes_remove_fake_spec);
    });
});
