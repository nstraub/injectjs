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

    beforeEach () ->
        injector.currentHashCode = 1

    afterEach () ->
        injector.types = {}
        injector.providers = {}
        injector.fakes = {}
        no_conflict_providers.cache = {}
        injector.state = {}

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

        describe 'inject', injection_inject_spec

        describe 'harness', injection_harness_spec

        describe 'run', injection_run_spec

    describe 'lifetime', () ->
        test_provider_spy = null
        test_provider_dependency_stub = null

        beforeEach () ->
            test_provider_spy = sinon.spy()
            test_provider_dependency_stub = sinon.stub()
            test_provider_dependency_stub.returns('test')
            injector.types =
                test:
                    name: 'test'
                    dependencies: ['transient_test']
                    type: class test_type
                        constructor: (@transient_test) ->
                    lifetime: 'transient'
                singleton_test:
                    name: 'singleton_test'
                    dependencies: null
                    type: class singleton_test_type
                    lifetime: 'singleton'
                transient_test:
                    name: 'transient_test'
                    dependencies: null
                    type: class transient_test_type
                    lifetime: 'transient'
                instance_test:
                    name: 'instance_test'
                    dependencies: null
                    type: class instance_test_type
                    lifetime: 'instance'
                parent_test:
                    name: 'parent_test'
                    dependencies: null
                    type: class parent_test_type
                    lifetime: 'parent'
                test_dependency:
                    name: 'test_dependency'
                    dependencies: null
                    type: class test_dependency
                    lifetime: 'transient'
            injector.providers =
                test_provider:
                    name: 'test_provider'
                    dependencies: null
                    type: test_provider_spy
                    lifetime: 'transient'
                test_provider_dependency:
                    name: 'test_provider_dependency'
                    dependencies: null
                    type: test_provider_dependency_stub
                    lifetime: 'transient'

        describe 'singleton', lifetimes_singleton_spec

        describe 'state', lifetimes_state_spec

        describe 'transient', lifetimes_transient_spec

        describe 'root', () ->
            it 'creates one instance of the type per root invocation of the inject function'
        describe 'parent', () ->
            it 'creates one instance of the type for a dependency and all of its dependencies'
            it 'creates a different instance of the type for a sibling dependency'

    describe 'caching', () ->
        describe 'injection', caching_injection_spec

        describe 'registration', caching_registration_spec

    describe 'fakes', () ->
        describe 'flushFakes', fakes_flush_fakes_spec
        describe 'removeFake', fakes_remove_fake_spec
