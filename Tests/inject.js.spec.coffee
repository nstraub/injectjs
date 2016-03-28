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
                        hashCode: setup.next_hash()
                    third_level_dependency:
                        name: 'third_level_dependency'
                        dependencies: ['root_dependency']
                        type: (@root) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()
                    second_level_dependency:
                        name: 'second_level_dependency'
                        dependencies: ['third_level_dependency']
                        type: (@third) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()
                    second_level_dependency2:
                        name: 'second_level_dependency2'
                        dependencies: ['third_level_dependency', 'root_dependency']
                        type: (@third, @root) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()
                    base_type:
                        name: 'base_type'
                        dependencies: ['second_level_dependency', 'second_level_dependency2', 'second_level_dependency2']
                        type: (@second, @second2, @second3) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()

            it 'creates one instance of the type per root invocation of the inject function', () ->
                first = injector.inject('base_type')

                second = injector.inject('second_level_dependency2')

                first = first()
                second = second()

                first_root = first.second.third.root
                expect(first.second2.root).toBe(first_root)
                expect(first.second2.third.root).toBe(first_root)
                expect(first.second3.root).toBe(first_root)
                expect(first.second3.third.root).toBe(first_root)

                second_root = second.root
                expect(second.third.root).toBe(second_root)
                expect(first_root).not.toBe(second_root)

            it 'allows root lifetime types to be roots themselves', () ->
                expect(() -> injector.get('root_dependency')).not.toThrow();

        describe 'parent', () ->
            beforeEach () ->
                setup.reset_injector()
                injector.types =
                    parent_dependency:
                        name: 'parent_dependency'
                        type: () -> return
                        lifetime: 'parent'
                        hashCode: setup.next_hash()
                    root_dependency:
                        name: 'root_dependency'
                        type: () -> return
                        lifetime: 'root'
                        hashCode: setup.next_hash()
                    third_level_dependency:
                        name: 'third_level_dependency'
                        dependencies: ['parent_dependency']
                        type: (@parent) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()
                    third_level_dependency2:
                        name: 'third_level_dependency2'
                        dependencies: ['parent_dependency', 'root_dependency']
                        type: (@parent, @root) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()
                    second_level_dependency:
                        name: 'second_level_dependency'
                        dependencies: ['third_level_dependency']
                        type: (@third) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()
                    second_level_dependency2:
                        name: 'second_level_dependency2'
                        dependencies: ['third_level_dependency', 'parent_dependency']
                        type: (@third, @parent) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()
                    second_level_dependency3:
                        name: 'second_level_dependency3'
                        dependencies: ['third_level_dependency2', 'root_dependency']
                        type: (@third, @root) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()
                    base_type:
                        name: 'base_type'
                        dependencies: ['second_level_dependency', 'second_level_dependency2', 'second_level_dependency2']
                        type: (@second, @second2, @second3) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()
                    base_parent_type:
                        name: 'base_parent_type'
                        dependencies: ['second_level_dependency2', 'parent_dependency']
                        type: (@second, @parent) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()
                    base_type_with_roots:
                        name: 'base_type'
                        dependencies: ['second_level_dependency2', 'second_level_dependency3', 'third_level_dependency2']
                        type: (@second2, @second3, @third) -> return
                        lifetime: 'transient'
                        hashCode: setup.next_hash()

            it 'creates one instance of the type for its parent and all of its dependencies', () ->
                provider = injector.inject 'second_level_dependency2'
                type = provider()

                expect(type.parent).toBeInstanceOf(injector.getType('parent_dependency'))
                expect(type.third.parent).toBeInstanceOf(injector.getType('parent_dependency'))
                expect(type.parent).toBe(type.third.parent)

            it 'creates a different instance of the type for its parents siblings', () ->
                provider = injector.inject 'base_type'
                type = provider()

                expect(type.second.third.parent).toBeInstanceOf(injector.getType('parent_dependency'))
                expect(type.second2.third.parent).toBeInstanceOf(injector.getType('parent_dependency'))
                expect(type.second2.parent).toBeInstanceOf(injector.getType('parent_dependency'))
                expect(type.second3.third.parent).toBeInstanceOf(injector.getType('parent_dependency'))
                expect(type.second3.parent).toBeInstanceOf(injector.getType('parent_dependency'))

                expect(type.second2.third.parent).toBe(type.second2.parent)
                expect(type.second3.third.parent).toBe(type.second3.parent)
                expect(type.second.third.parent).not.toBe(type.second2.parent)
                expect(type.second.third.parent).not.toBe(type.second3.parent)
                expect(type.second2.parent).not.toBe(type.second3.parent)

            it 'references the topmost parent that contains the dependency', () ->
                provider = injector.inject 'base_parent_type'
                type = provider()

                expect(type.parent).toBe(type.second.third.parent)

            it 'doesn`t interfere with `root` lifetime types', () ->
                provider = injector.inject 'base_type_with_roots'
                type = provider()

                expect(type.second3.third.root).toBe(type.second3.root)
                expect(type.third.root).toBe(type.second3.root)

    describe 'caching', () ->
        describe 'injection', caching_injection_spec
        describe 'registration', caching_registration_spec

    describe 'fakes', () ->
        describe 'flushFakes', fakes_flush_fakes_spec
        describe 'removeFake', fakes_remove_fake_spec
