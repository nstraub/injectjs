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

    it 'allows multiple instances of the same type to be injected into one dependant', () ->
        injector.types.multiple_instances =
            name: 'multiple_instances'
            type: (@a, @b) -> return
            dependencies: ['transient_test', 'transient_test']
            lifetime: 'transient'

        instance = injector.get('multiple_instances')

        expect(instance.a).toBeDefined()
        expect(instance.b).toBeDefined()
        expect(instance.a).not.toBe(instance.b)


    describe 'ad-hoc dependencies', get_adhoc_dependency_tests('transient')
