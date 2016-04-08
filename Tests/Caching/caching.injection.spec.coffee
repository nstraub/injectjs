caching_injection_spec = () ->
    beforeEach () ->
        setup.reset_injector()
        setup.assign_base_types()
        setup.assign_basic_dependent_types()
        sinon.spy injector, '_build_provider'

    afterEach () ->
        injector._build_provider.restore()

    describe 'basic dependency-less caching', () ->
        for lifetime in lifetimes
            do (lifetime) ->
                type = 'base_' + lifetime + '_type'
                it 'caches ' + type, () ->
                    first_type = injector.inject(type)()

                    second_type = injector.inject(type)()

                    third_type = injector.inject(type)()

                    expect(first_type).toBeInstanceOf injector.getType(type)
                    expect(second_type).toBeInstanceOf injector.getType(type)
                    expect(third_type).toBeInstanceOf injector.getType(type)

                    expect(injector._build_provider).toHaveBeenCalledOnce()

    describe 'basic one-level dependency caching', () ->
        for lifetime in lifetimes
            for dependency_lifetime in lifetimes
                do (lifetime, dependency_lifetime) ->
                    type = lifetime + '_depends_on_' + dependency_lifetime
                    it 'caches ' + type, () ->
                        first_type = injector.inject(type)()

                        second_type = injector.inject(type)()

                        third_type = injector.inject(type)()

                        expect(first_type).toBeInstanceOf injector.getType(type)
                        expect(second_type).toBeInstanceOf injector.getType(type)
                        expect(third_type).toBeInstanceOf injector.getType(type)

                        expect(injector._build_provider).toHaveBeenCalledTwice()

                    if !(lifetime in ['state', 'singleton'] || dependency_lifetime in ['state', 'singleton'])
                        it lifetime + ' discards stale base_' + dependency_lifetime + '_type', () ->
                            first = injector.get(type)
                            injector.registerType 'base_' + dependency_lifetime + '_type', (()->), dependency_lifetime
                            second = injector.get(type)

                            expect(second.dependency).toBeInstanceOf injector.types['base_' + dependency_lifetime + '_type'].type
