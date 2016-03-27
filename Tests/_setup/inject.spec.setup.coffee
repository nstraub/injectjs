setup =
    reset_injector: (reset_hash_code) ->
        injector.currentHashCode = 1 if reset_hash_code
        injector.types = {}
        injector.providers = {}
        injector.fakes = {}
        injector.cache = {}
        injector.state = {}

        return
    next_hash: () -> return injector.currentHashCode++
    make_descriptor: (target, name, lifetime, type, dependencies, provider) ->
        injector[target][name] =
            name: name
            type: type || () -> return
            hashCode: @next_hash()
            dependencies: dependencies
            lifetime: lifetime
            provider: provider

        return
    assign_base_types: () ->
        for lifetime in lifetimes
            @make_descriptor('types', 'base_' + lifetime + '_type', lifetime)

        return

    assign_base_providers: () ->
        @make_descriptor('providers', 'base_provider')

        return

    assign_passive_types: () ->
        for lifetime in lifetimes
            @make_descriptor('types', 'passive_' + lifetime + '_type', lifetime, null, null, 'passive_' + lifetime + '_provider')
            @make_descriptor('providers', 'passive_' + lifetime + '_provider', null, ((type) ->
                type.passively_provided = true
                return type), ['passive_' + lifetime + '_type'])

        return

    assign_basic_dependent_types: () ->
        for lifetime in lifetimes
            for dependency_lifetime in lifetimes
                @make_descriptor(
                    'types',
                    lifetime + '_depends_on_' + dependency_lifetime,
                    lifetime,
                    (@dependency) -> return,
                    ['base_' + dependency_lifetime + '_type']
                )
