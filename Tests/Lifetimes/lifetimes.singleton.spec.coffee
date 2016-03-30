lifetimes_singleton_spec = () ->
    it 'creates one instance of the type per injector', () ->
        first_singleton_instance = injector.get('base_singleton_type')
        second_singleton_instance = injector.get('base_singleton_type')

        expect(first_singleton_instance).toBeInstanceOf injector.getType('base_singleton_type')
        expect(second_singleton_instance).toBeInstanceOf injector.getType('base_singleton_type')
        expect(first_singleton_instance).toBe second_singleton_instance
