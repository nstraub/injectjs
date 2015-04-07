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
