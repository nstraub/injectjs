injection_get_spec = () ->
    beforeEach () ->
        setup.reset_injector()

        injector.providers =
            test_provider:
                type: () -> @

    it 'applies a context when provided', () ->
        result = injector.get('test_provider', @)
        expect(result).toBe @
