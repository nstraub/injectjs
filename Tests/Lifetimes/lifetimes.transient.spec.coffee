lifetimes_transient_spec = () ->
    it 'creates one instance of the type per dependency requirement', () ->
        first_transient_instance = injector.get 'transient_test'
        second_transient_instance = injector.get 'transient_test'

        expect(first_transient_instance).not.toBe second_transient_instance

    it 'creates one instance of the type per dependency requirement when they are part of a parent dependency', () ->
        instantiator = injector.inject 'test'
        first_test_instance = instantiator()
        second_test_instance = instantiator()

        expect(first_test_instance.transient_test).not.toBe second_test_instance.transient_test

    describe 'parametrized types', () ->
        beforeEach () ->
            injector.types =
                test_parametrized_type:
                    type: (@adhoc_dependency) -> return
                    dependencies: ['adhoc_dependency']
                    lifetime: 'transient'
                test_parametrized_ordered_type:
                    type: (@f,@e,@c,@d,@b,@a) -> return
                    dependencies: ['f','e','c','d','b','a']
                    lifetime: 'transient'

            injector.providers =
                a:
                    type: () -> return 1;
                    dependencies: null
                c:
                    type: () -> return 3;
                    dependencies: null
                e:
                    type: () -> return 5;
                    dependencies: null

        it 'injects adhoc dependency at instantiation time', () ->
            test = injector.inject 'test_parametrized_type'
            result = test(adhoc_dependency: 'test dependency')

            expect(result.adhoc_dependency).toBe 'test dependency'

        it 'maintains proper dependency order', () ->
            test = injector.inject 'test_parametrized_ordered_type'
            result = test({b:2,d:4,f:6})

            expect(result.f).toBe 6
            expect(result.e).toBe 5
            expect(result.d).toBe 4
            expect(result.c).toBe 3
            expect(result.b).toBe 2
            expect(result.a).toBe 1

