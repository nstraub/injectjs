lifetimes_state_spec = () ->
    it 'creates one instance of the type per state', () ->
        first_instance = injector.get('base_state_type')
        second_instance = injector.get('base_state_type')

        expect(first_instance).toBeInstanceOf injector.getType('base_state_type')
        expect(second_instance).toBeInstanceOf injector.getType('base_state_type')
        expect(first_instance).toBe second_instance

    describe 'clearState', () ->
        it 'clears state objects', () ->
            first_singleton_instance = injector.get('base_state_type')
            injector.clearState();
            second_singleton_instance = injector.get('base_state_type')

            expect(first_singleton_instance).toBeInstanceOf injector.getType('base_state_type')
            expect(second_singleton_instance).toBeInstanceOf injector.getType('base_state_type')
            expect(first_singleton_instance).not.toBe second_singleton_instance

    describe 'ad-hoc dependencies', get_adhoc_dependency_tests('state')
