get_adhoc_dependency_tests = (lifetime) ->
    () ->
        beforeEach () ->
            injector.types =
                test_type:
                    name: 'test_type'
                    type: (@adhoc_dependency) -> return
                    dependencies: ['adhoc_dependency']
                    lifetime: lifetime
                ordered_test_type:
                    name: 'ordered_test_type'
                    type: (@f, @e, @c, @d, @b, @a) -> return
                    dependencies: ['f', 'e', 'c', 'd', 'b', 'a']
                    lifetime: lifetime

            injector.providers =
                a:
                    name: 'a'
                    type: () -> return 1;
                    dependencies: null
                c:
                    name: 'c'
                    type: () -> return 3;
                    dependencies: null
                e:
                    name: 'e'
                    type: () -> return 5;
                    dependencies: null

        it 'injects ad-hoc dependency at instantiation time', () ->
            test = injector.inject 'test_type'
            result = test(adhoc_dependency: 'test dependency')

            expect(result.adhoc_dependency).toBe 'test dependency'

        it 'maintains proper dependency order', () ->
            test = injector.inject 'ordered_test_type'
            result = test({b: 2, d: 4, f: 6})

            expect(result.f).toBe 6
            expect(result.e).toBe 5
            expect(result.d).toBe 4
            expect(result.c).toBe 3
            expect(result.b).toBe 2
            expect(result.a).toBe 1

        it 'passes ad-hoc dependencies up the dependency tree', () ->
            injector.types.parent_adhoc_type =
                type: (@test_type, @test_parameterized_orderd_type) -> return
                dependencies: ['test_type', 'ordered_test_type']
                lifetime: 'transient'

            test_provider = injector.inject 'parent_adhoc_type'

            result = test_provider({b: 2, d: 4, f: 6, adhoc_dependency: 'test dependency'})

            expect(result.test_parameterized_orderd_type).toBeInstanceOf(injector.types.ordered_test_type.type)
            expect(result.test_type).toBeInstanceOf(injector.types.test_type.type)

            test_provider = injector.inject 'parent_adhoc_type'

            result = test_provider({b: 2, d: 4, f: 6, adhoc_dependency: 'test dependency'})

            expect(result.test_parameterized_orderd_type).toBeInstanceOf(injector.types.ordered_test_type.type)
            expect(result.test_type).toBeInstanceOf(injector.types.test_type.type)

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
        injector.cache = {}
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
                    name: 'root_test'
                    dependencies: null
                    type: class root_test_type
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
            beforeEach () ->
                injector.types =
                    root_dependency:
                        name: 'root_dependency'
                        dependencies: null
                        type: class root_dependency
                        lifetime: 'root'
                    third_level_dependency:
                        name: 'third_level_dependency'
                        dependencies: ['root_dependency']
                        type: (@root) -> return
                        lifetime: 'transient'
                    second_level_dependency:
                        name: 'second_level_dependency'
                        dependencies: ['third_level_dependency']
                        type: (@third) -> return
                        lifetime: 'transient'
                    second_level_dependency2:
                        name: 'second_level_dependency2'
                        dependencies: ['third_level_dependency', 'root_dependency']
                        type: (@third, @root) -> return
                        lifetime: 'transient'
                    base_type:
                        name: 'base_type'
                        dependencies: ['second_level_dependency', 'second_level_dependency2', 'second_level_dependency2']
                        type: (@second, @second2, @second3) -> return
                        lifetime: 'transient'

            it 'creates one instance of the type per root invocation of the inject function', () ->
                first = injector.get('base_type')

                second = injector.get('second_level_dependency2')

                first_root = first.second.third.root
                expect(first.second2.root).toBe(first_root)
                expect(first.second2.third.root).toBe(first_root)
                expect(first.second3.root).toBe(first_root)
                expect(first.second3.third.root).toBe(first_root)

                second_root = second.root
                expect(second.third.root).toBe(second_root)
                expect(first_root).not.toBe(second_root)

        describe 'parent', () ->
            it 'creates one instance of the type for its parent and all of its dependencies'
            it 'creates a different instance of the type for its parents siblings'
            it 'doesn`t interfere with `root` lifetime types'
    describe 'caching', () ->
        describe 'injection', caching_injection_spec

        describe 'registration', caching_registration_spec

    describe 'fakes', () ->
        describe 'flushFakes', fakes_flush_fakes_spec
        describe 'removeFake', fakes_remove_fake_spec
