lifetimes_state_spec = () ->
    beforeEach () ->
        injector.types.state_test =
            type: () -> return
            dependencies: null
            lifetime: 'state'

    it 'creates one instance of the type per state', () ->
        first_instance = injector.get('state_test')
        second_instance = injector.get('state_test')

        expect(first_instance).toBeInstanceOf injector.getType('state_test')
        expect(second_instance).toBeInstanceOf injector.getType('state_test')
        expect(first_instance).toBe second_instance

    describe 'clearState', () ->
        it 'clears state objects', () ->
            first_singleton_instance = injector.get('state_test')
            injector.clearState();
            second_singleton_instance = injector.get('state_test')

            expect(first_singleton_instance).toBeInstanceOf injector.getType('state_test')
            expect(second_singleton_instance).toBeInstanceOf injector.getType('state_test')
            expect(first_singleton_instance).not.toBe second_singleton_instance

    describe 'parametrized types', () ->
        beforeEach () ->
            injector.types =
                test_parametrized_type:
                    type: (@adhoc_dependency) -> return
                    dependencies: ['adhoc_dependency']
                    lifetime: 'state'
                test_parametrized_ordered_type:
                    type: (@f,@e,@c,@d,@b,@a) -> return
                    dependencies: ['f','e','c','d','b','a']
                    lifetime: 'state'

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

