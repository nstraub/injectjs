lifetimes = ['transient', 'root', 'state', 'singleton', 'parent']

get_adhoc_dependency_tests = (lifetime) ->
    () ->
        beforeEach () ->
            setup.reset_injector_cache()
            setup.make_descriptor
                name: 'test_type'
                type: (@adhoc_dependency) -> return
                dependencies: ['adhoc_dependency']
                lifetime: lifetime
            setup.make_descriptor
                name: 'ordered_test_type'
                type: (@f, @e, @c, @d, @b, @a) -> return
                dependencies: ['f', 'e', 'c', 'd', 'b', 'a']
                lifetime: lifetime


            setup.make_descriptor
                target: 'providers'
                name: 'a'
                type: () -> return 1
            setup.make_descriptor
                target: 'providers'
                name: 'c'
                type: () -> return 3
            setup.make_descriptor
                target: 'providers'
                name: 'e'
                type: () -> return 5

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
                name: 'parent_adhoc_type'
                type: (@test_type, @ordered_test_type) -> return
                dependencies: ['test_type', 'ordered_test_type']
                lifetime: 'transient'

            test_provider = injector.inject 'parent_adhoc_type'

            result = test_provider({b: 2, d: 4, f: 6, adhoc_dependency: 'test dependency'})

            expect(result.ordered_test_type).toBeInstanceOf(injector.types.ordered_test_type.type)
            expect(result.test_type).toBeInstanceOf(injector.types.test_type.type)

            test_provider = injector.inject 'parent_adhoc_type'

            result = test_provider({b: 2, d: 4, f: 6, adhoc_dependency: 'test dependency'})

            expect(result.ordered_test_type).toBeInstanceOf(injector.types.ordered_test_type.type)
            expect(result.test_type).toBeInstanceOf(injector.types.test_type.type)


