caching_registration_spec = () ->
    beforeAll () ->
        setup.make_descriptor
            name: 'test_type'
        setup.make_descriptor
            target: 'providers'
            name: 'test_provider'
        setup.make_descriptor
            name: 'singleton_test_type'
            lifetime: 'singleton'

    it 'clears cached dependency for type name', () ->
        injector.inject('test_type')

        injector.registerType('test_type', () ->)

        expect(injector.cache.test_type).toBeUndefined()

    it 'clears cached dependency for provider name', () ->
        injector.inject('test_provider')

        injector.registerProvider('test_provider', () ->)

        expect(injector.cache.test_type).toBeUndefined()

    it 'throws an error when trying to register a singleton type that`s already registered and instantiated', () ->
        injector.get('singleton_test_type')

        expect(() -> injector.registerType('singleton_test_type', (() -> return), 'singleton')).toThrow(
            'you cannot re-register a singleton that has already been instantiated'
        )
