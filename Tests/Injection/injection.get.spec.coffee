injection_get_spec = () ->
    beforeAll () ->
        setup.reset_injector()
        setup.assign_context_dependent_types()

    it 'applies a context when provided', () ->
        result = injector.get('provider_returns_context', @)
        expect(result).toBe @

    for lifetime in lifetimes
        for dependency_lifetime in lifetimes when dependency_lifetime isnt 'singleton' and dependency_lifetime isnt 'state'
            do (lifetime, dependency_lifetime) ->
                it lifetime + ' passes context up ' + dependency_lifetime + ' dependency tree', ->
                    type = injector.get lifetime + '_provides_context_through_' + dependency_lifetime, @

                    expect(type.dependency.dependency).toBe(@)
