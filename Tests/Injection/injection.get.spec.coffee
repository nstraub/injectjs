injection_get_spec = () ->
    beforeAll () ->
        setup.reset_injector()
        setup.assign_context_dependent_types()

    it 'applies a context when provided', () ->
        result = injector.get('provider_returns_context', null, @)
        expect(result).toBe @

    for lifetime in lifetimes
        for dependency_lifetime in lifetimes when dependency_lifetime isnt 'singleton' and dependency_lifetime isnt 'state'
            do (lifetime, dependency_lifetime) ->
                it lifetime + ' passes context up ' + dependency_lifetime + ' dependency tree', ->
                    type = injector.get lifetime + '_provides_context_through_' + dependency_lifetime, null, @

                    expect(type.dependency.dependency).toBe(@)

    describe 'providers', () ->
        beforeAll () ->
            setup.assign_base_types()
        it 'returns the type`s provider when ::provider suffix is passed', () ->
            provider = injector.get('base_transient_type::provider')
            expect(provider()).toBeInstanceOf injector.types.base_transient_type.type
        it 'doesn`t interfere with parent lifetime in dependency tree', () ->
            setup.assign_passive_types()
            setup.make_descriptor
                name: 'base_type'
                type: (@transient1) -> return
                dependencies: ['transient1']

            setup.make_descriptor
                name: 'transient1'
                type: (@parent_lifetime) -> return
                dependencies: ['passive_parent_type']

            debugger
            provider = injector.get('base_type::provider')
            type1 = provider()
            type2 = provider()
            expect(type1.transient1.parent_lifetime).not.toBe(type2.transient1.parent_lifetime)

        it 'doesn`t interfere with parent lifetime when child of a root object in dependency tree', () ->
            setup.assign_passive_types()
            setup.make_descriptor
                name: 'base_type'
                type: (@root_provider) -> return
                dependencies: ['root1::provider']

            setup.make_descriptor
                name: 'root1'
                type: (@parent_lifetime) -> return
                dependencies: ['passive_parent_type']
                lifetime: 'root'

            base1 = injector.get('base_type')
            base2 = injector.get('base_type')

            type1 = base1.root_provider()
            type2 = base2.root_provider()
            expect(type1.parent_lifetime).not.toBe(type2.parent_lifetime)

        it 'undescribed bug', () ->
            setup.reset_injector()
            setup.make_descriptor
                name: 'base_type'
                type: (@root_type_1) -> return
                dependencies: ['root_type_1']

            setup.make_descriptor
                name: 'root_type_1'
                type: (@root_type_2) -> return
                dependencies: ['root_type_2']
                lifetime: 'root'

            setup.make_descriptor
                name: 'root_type_2'
                type: (@provider1, @ad_hoc_1, @transient_1_provider) ->
                    @transients = []
                    @transients.push(@transient_1_provider.call(@provider1, {@ad_hoc_1}))
                    @transients.push(@transient_1_provider.call(@provider1, {@ad_hoc_1}))
                    @transients.push(@transient_1_provider.call(@provider1, {@ad_hoc_1}))
                    return
                dependencies: ['provider1', 'ad_hoc_1', 'transient_1::provider']
                lifetime: 'root'

            setup.make_descriptor
                target: 'providers'
                name: 'provider1'
                type: () -> return 'provider1'

            setup.make_descriptor
                name: 'transient_1'
                type: (@parent_type_1, @parent_type_2) -> return
                dependencies: ['parent_type_1', 'parent_type_2']

            setup.make_descriptor
                name: 'transient_2'
                provider: [
                    'type'
                    (type) -> type
                ]

            setup.make_descriptor
                name: 'parent_type_1'
                type: (@transient_2) -> return
                dependencies: ['transient_2']
                lifetime: 'parent'
                provider: [
                    'type'
                    'parent_type_2'
                    (type, parent_type_2) ->
                        type.parent_type_2 = parent_type_2
                        return type
                    ]

            setup.make_descriptor
                name: 'parent_type_2'
                type: (@transient_2) -> return
                dependencies: ['transient_2']
                lifetime: 'parent'
                provider: [
                    'type'
                    (type) ->
                        return type
                    ]

            type = injector.get('base_type', ad_hoc_1: 'adhoc2')
            type = injector.get('base_type', ad_hoc_1: 'adhoc2')
            transients = type.root_type_1.root_type_2.transients

            expect(transients[0]).not.toBe(transients[1])
            expect(transients[0]).not.toBe(transients[2])
            expect(transients[1]).not.toBe(transients[2])


            expect(transients[0].parent_type_1).not.toBe(transients[1].parent_type_1)
            expect(transients[0].parent_type_1).not.toBe(transients[2].parent_type_1)
            expect(transients[1].parent_type_1).not.toBe(transients[2].parent_type_1)


            expect(transients[0].parent_type_1.parent_type_2).not.toBe(transients[1].parent_type_1.parent_type_2)
            expect(transients[0].parent_type_2).not.toBe(transients[2].parent_type_2)
            expect(transients[1].parent_type_2).not.toBe(transients[2].parent_type_2)

