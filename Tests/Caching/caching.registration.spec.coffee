caching_registration_spec = () ->
    beforeEach () ->
        injector.types.test_type =
            hashCode: 0
            lifetime: 'transient'
            type: () -> return
            dependencies: null
    it 'clears cached dependency for type name', () ->
        test_type_provider = injector.inject('test_type')

        injector.registerType('test_type', () ->)

        expect(test_type_provider).not.toBe injector.inject('test_type')
