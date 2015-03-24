injection_harness_spec = () ->
    beforeEach () ->
        sinon.spy injector, 'inject'

    afterEach () ->
        injector.inject.restore()

    it 'delays injection until passed function is instantiated', () ->
        test_method = () ->
            'test'

        harness = injector.harness test_method

        expect(injector.inject).not.toHaveBeenCalled()

        result = harness()

        expect(injector.inject).toHaveBeenCalledWith(test_method)
        expect(result).toBe 'test'
