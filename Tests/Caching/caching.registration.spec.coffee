caching_registration_spec = () ->
    beforeEach () ->
        injector.types.test_type =
            hashCode: 0
            lifetime: 'transient'
            type: () -> return
            dependencies: null
        injector.types.singleton_test_type =
            name: 'singleton_test_type'
            hashCode: 1
            lifetime: 'singleton'
            type: () -> return
            dependencies: null
    it 'clears cached dependency for type name', () ->
        test_type_provider = injector.inject('test_type')

        injector.registerType('test_type', () ->)

        expect(test_type_provider).not.toBe injector.inject('test_type')
    it 'throws an error when trying to register a singleton type that`s already registered and instantiated', () ->
        injector.get('singleton_test_type')

        expect(() -> injector.registerType('singleton_test_type', (() -> return), 'singleton')).toThrow(
            'you cannot re-register a singleton that has already been instantiated'
        )
