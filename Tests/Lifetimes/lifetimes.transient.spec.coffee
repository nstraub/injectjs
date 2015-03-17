lifetimes_transient_spec = () ->
    it 'creates one instance of the type per dependency requirement', () ->
        first_transient_instance = injector.instantiate 'transient_test'
        second_transient_instance = injector.instantiate 'transient_test'

        expect(first_transient_instance).not.toBe second_transient_instance

    it 'creates one instance of the type per dependency requirement when they are part of a parent dependency', () ->
        instantiator = injector.inject 'test'
        first_test_instance = instantiator()
        second_test_instance = instantiator()

        expect(first_test_instance.transient_test).not.toBe second_test_instance.transient_test
