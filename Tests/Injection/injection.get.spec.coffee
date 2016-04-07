injection_get_spec = () ->
    beforeEach () ->
        setup.reset_injector()
        setup.assign_context_dependent_types()

    it 'applies a context when provided', () ->
        result = injector.get('provider_returns_context', @)
        expect(result).toBe @

    for lifetime in lifetimes
        do (lifetime) ->
            it lifetime + ' passes context up dependency tree', ->
                type = injector.get lifetime + '_provides_context', @

                expect(type.dependency).toBe(@)
