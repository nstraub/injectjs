setup =
    reset_injector: () ->
        injector.currentHashCode = 1
        injector.types = {}
        injector.providers = {}
        injector.fakes = {}
        @reset_injector_cache()

        return
    reset_injector_cache: () ->
        injector.cache = {}
        injector.state = {}

        return
    next_hash: () -> return injector.currentHashCode++
    make_descriptor: (options) ->
        {
            target = 'types'
            name
            lifetime = ('transient' if target is 'types')
            type = (() -> return)
            dependencies
            provider
        } = options

        injector[target][name] =
            name: name
            type: type
            hashCode: @next_hash()
            dependencies: dependencies
            lifetime: lifetime
            provider: provider

        return
    assign_base_types: () ->
        for lifetime in lifetimes
            @make_descriptor(name: 'base_' + lifetime + '_type', lifetime: lifetime)

        return

    assign_base_providers: () ->
        @make_descriptor(target: 'providers', name: 'base_provider')
        @make_descriptor(target: 'providers', name: 'provider_returns_context', type: () -> @)

        return

    assign_passive_types: () ->
        for lifetime in lifetimes
            @make_descriptor(
                name: 'passive_' + lifetime + '_type'
                lifetime: lifetime
                provider: 'passive_' + lifetime + '_provider'
            )
            @make_descriptor(
                target: 'providers'
                name: 'passive_' + lifetime + '_provider'
                type: (type) ->
                    type.passively_provided = true
                    return type
                dependencies: ['passive_' + lifetime + '_type']
            )

        return

    assign_basic_dependent_types: () ->
        for lifetime in lifetimes
            for dependency_lifetime in lifetimes
                @make_descriptor(
                    name: lifetime + '_depends_on_' + dependency_lifetime
                    lifetime: lifetime
                    type: (@dependency) -> return,
                    dependencies: ['base_' + dependency_lifetime + '_type']
                )

        return

    assign_context_dependent_types: () ->
        @assign_base_providers()
        for lifetime in lifetimes
            @make_descriptor(lifetime: lifetime, name: lifetime + '_provides_context', dependencies: ['provider_returns_context'], type: (@dependency) -> return)
            for dependency_lifetime in lifetimes
                @make_descriptor(
                    lifetime: lifetime
                    name: lifetime + '_provides_context_through_' + dependency_lifetime
                    dependencies: [dependency_lifetime + '_provides_context']
                    type: (@dependency) -> return
                )
