describe 'injector', () ->
    beforeAll ->
        jasmine.addMatchers toBeInstanceOf: ->
            { compare: (actual, expected) ->
                result = undefined
                result =
                    pass: actual instanceof expected
                if result.pass
                    result.message = 'Expected ' + actual + ' not to be an instance of ' + expected
                else
                    result.message = 'Expected ' + actual + ' to be an instance of ' + expected
                return result
            }
        return

    describe 'registration', () ->
        beforeEach () ->
            @test_type = () ->
            @test_result =
                hashCode: 1
                name: 'test type',
                type: @test_type,
                dependencies: null,
                lifetime: 'transient'

        describe 'register', registration_register_spec

        describe 'registerType', registration_register_type_spec

        describe 'registerProvider', registration_register_provider_spec

        describe 'register main', registration_register_main_spec

        describe 'registerFake', registration_register_fake_spec


    describe 'getType', utility_get_type_spec

    describe 'extend', utility_extend_spec

    describe 'noConflict', utility_no_conflict_spec

    describe 'injection', () ->
        describe 'get', injection_get_spec

        describe 'inject', injection_inject_types_spec

        describe 'providers', injection_inject_providers_spec

        describe 'harness', injection_harness_spec

        describe 'run', injection_run_spec

    describe 'lifetime', () ->
        beforeAll () ->
            setup.reset_injector()
            setup.assign_base_types()
            setup.assign_basic_dependent_types()

        describe 'singleton', lifetimes_singleton_spec

        describe 'state', lifetimes_state_spec

        describe 'transient', lifetimes_transient_spec

        describe 'root', lifetimes_root_spec

        describe 'parent', lifetimes_parent_spec
    describe 'caching', () ->
        describe 'injection', caching_injection_spec
        describe 'registration', caching_registration_spec

    describe 'fakes', () ->
        describe 'flushFakes', fakes_flush_fakes_spec
        describe 'removeFake', fakes_remove_fake_spec
