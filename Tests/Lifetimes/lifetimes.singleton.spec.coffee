lifetimes_singleton_spec = () ->
    it 'creates one instance of the type per injector', () ->
        first_singleton_instance = injector.get('singleton_test')
        second_singleton_instance = injector.get('singleton_test')

        expect(first_singleton_instance).toBeInstanceOf injector.getType('singleton_test')
        expect(second_singleton_instance).toBeInstanceOf injector.getType('singleton_test')
        expect(first_singleton_instance).toBe second_singleton_instance

    describe 'clear singletons', () ->
        it 'clears all singleton providers', () ->
            first_singleton_instance = injector.get('singleton_test')
            injector.clearSingletons();
            second_singleton_instance = injector.get('singleton_test')

            expect(first_singleton_instance).toBeInstanceOf injector.getType('singleton_test')
            expect(second_singleton_instance).toBeInstanceOf injector.getType('singleton_test')
            expect(first_singleton_instance).not.toBe second_singleton_instance
