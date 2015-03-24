caching_registration_spec = () ->
    beforeEach () ->
        injector.cache.test_type = 'test type'
    it 'clears cached dependency for type name', () ->
        injector.registerType('test_type', () ->)

        expect(injector.cache.test_type).toBeUndefined()
