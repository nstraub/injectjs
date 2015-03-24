caching_injection_spec = () ->
    beforeEach () ->
        injector.types =
            test_type:
                type: () ->
                dependencies: null
                lifetime: 'transient'

        injector.providers =
            test_provider:
                type: () ->
                dependencies: null

    it 'caches injected types', () ->
        first_injector = injector.inject('test_type')
        second_injector = injector.inject('test_type')

        expect(first_injector).toBe second_injector

    it 'caches injected providers', () ->
        first_injector = injector.inject('test_provider')
        second_injector = injector.inject('test_provider')

        expect(first_injector).toBe second_injector
