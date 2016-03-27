injection_inject_spec = () ->
    describe 'basic types', () ->
        beforeAll () ->
            setup.reset_injector()
            setup.assign_base_types()
            setup.assign_basic_dependent_types()


        for lifetime in lifetimes
            do (lifetime) ->
                it 'creates a function that returns an instance of ' + lifetime, () ->
                    type = 'base_' + lifetime + '_type'
                    provider = injector.inject(type)
                    expect(provider()).toBeInstanceOf(injector.types[type].type)

        for lifetime in lifetimes
            for dependency_lifetime in lifetimes
                do (lifetime, dependency_lifetime) ->
                    it 'instantiates a ' + lifetime + ' type that depends on a ' + dependency_lifetime + ' type', () ->
                        test = injector.inject lifetime + '_depends_on_' + dependency_lifetime
                        expect(test().dependency).toBeInstanceOf(injector.types['base_' + dependency_lifetime + '_type'].type)

    describe 'passive providers', () ->
        beforeAll () ->
            setup.reset_injector()
            setup.assign_passive_types()

        for lifetime in lifetimes
            do (lifetime) ->
                it 'uses passive_' + lifetime + '_provider to instantiate passive_' + lifetime + '_type', () ->
                    provider = injector.inject 'passive_' + lifetime + '_type'
                    type = provider()

                    expect(type).toBeInstanceOf injector.types['passive_' + lifetime + '_type'].type
                    expect(type.passively_provided).toBeTruthy()

                it 'caches the passive_' + lifetime + '_provider instead of passive_' + lifetime + '_type', () ->
                    provider = injector.inject 'passive_' + lifetime + '_type'
                    type = provider()

                    expect(type).toBeInstanceOf injector.types['passive_' + lifetime + '_type'].type
                    expect(type.passively_provided).toBeTruthy()

                    type.passively_provided = false

                    provider = injector.inject 'passive_' + lifetime + '_type'
                    type2 = provider()

                    expect(type2).toBeInstanceOf injector.types['passive_' + lifetime + '_type'].type
                    expect(type).toBe(type2) if lifetime in ['singleton', 'state']
                    expect(type2.passively_provided).toBeTruthy()


    describe 'anonymous types', () ->
        beforeAll () ->
            setup.reset_injector()
            setup.assign_base_types()

        for lifetime in lifetimes
            do (lifetime) ->
                it 'injects base_' + lifetime + '_type into an ad-hoc function descriptor', () ->
                    adhoc_function = (dependency) -> return dependency
                    descriptor = ['base_' + lifetime + '_type', adhoc_function]

                    adhoc_function_provider = injector.inject descriptor

                    expect(adhoc_function_provider()).toBeInstanceOf injector.types['base_' + lifetime + '_type'].type

                    return
            it 'injects base_' + lifetime + '_type into a function without a descriptor', () ->
                eval ('adhoc_function = function (base_' + lifetime + '_type) { return base_' + lifetime + '_type; }')

                adhoc_function_provider = injector.inject adhoc_function

                expect(adhoc_function_provider()).toBeInstanceOf injector.types['base_' + lifetime + '_type'].type

    describe 'fakes', () ->
        test_provider_spy = null
        beforeEach () ->
            test_provider_spy = sinon.spy()
            injector.fakes =
                test_provider:
                    name: 'test_provider'
                    dependencies: null
                    type: () ->
                    lifetime: 'transient'
                    hashCode: setup.next_hash()
            injector.providers =
                test_provider:
                    name: 'test_provider'
                    dependencies: null
                    type: test_provider_spy
                    hashCode: setup.next_hash()



        afterEach () ->
            injector.fakes = {}

        it 'prioritizes fakes over types and providers', () ->
            fake = injector.inject('test_provider')()

            expect(test_provider_spy).not.toHaveBeenCalled()

    it 'throws an error when provided dependency name isn`t registered', () ->
        expect(() ->
            injector.inject('nonexistent')).toThrow 'There is no dependency named "nonexistent" registered.'

    describe 'providers', () ->
        test_provider_spy = null
        test_provider_dependency_stub = null

        beforeEach () ->
            setup.reset_injector()
            test_provider_spy = sinon.spy()
            test_provider_dependency_stub = sinon.stub()
            test_provider_dependency_stub.returns('test')
            injector.providers =
                test_provider:
                    name: 'test_provider'
                    dependencies: null
                    type: test_provider_spy
                test_provider_dependency:
                    name: 'test_provider_dependency'
                    dependencies: null
                    type: test_provider_dependency_stub
                test_this_provider:
                    name: 'test_this_provider'
                    type: () -> return @
                    dependencies: null
                test_parametrized_provider:
                    name: 'test_parametrized_provider'
                    type: (test_provider_dependency, adhoc_dependency) -> return [test_provider_dependency, adhoc_dependency]
                    dependencies: ['test_provider_dependency', 'adhoc_dependency']
                a:
                    name: 'a'
                    type: () -> return 1;
                    dependencies: null
                c:
                    name: 'c'
                    type: () -> return 3;
                    dependencies: null
                e:
                    name: 'e'
                    type: () -> return 5;
                    dependencies: null
                test_parametrized_ordered_provider:
                    name: 'test_parametrized_ordered_provider'
                    type: (f,e,c,d,b,a) -> return [f,e,d,c,b,a]
                    dependencies: ['f','e','c','d','b','a']

        it 'gets a provider using caller`s context', () ->
            provider = injector.inject('test_this_provider').call(@)
            expect(provider).toBe @

        it 'gets a nested provider using caller`s context', () ->
            injector.providers.test_provider.dependencies = ['test_this_provider']
            injector.providers.test_provider.type = (ttp) -> return ttp

            provider = injector.inject('test_provider').call(@)
            expect(provider).toBe @

        it 'creates a function that returns the given provider', () ->
            test = injector.inject 'test_provider'
            test()
            expect(test_provider_spy).toHaveBeenCalledOnce()

        it 'injects dependencies into given provider', () ->
            injector.providers.test_provider.dependencies = ['test_provider_dependency']
            test = injector.inject 'test_provider'
            test()
            expect(test_provider_dependency_stub).toHaveBeenCalledOnce()
            expect(test_provider_spy).toHaveBeenCalledWith('test')

        describe 'parametrized providers', () ->
            it 'injects adhoc dependency at instantiation time', () ->
                test = injector.inject 'test_parametrized_provider'
                result = test(adhoc_dependency: 'test dependency')

                expect(result[1]).toBe 'test dependency'

            it 'maintains proper dependency order', () ->
                test = injector.inject 'test_parametrized_ordered_provider'
                result = test({b:2,d:4,f:6})

                expect(result[0]).toBe 6
                expect(result[1]).toBe 5
                expect(result[2]).toBe 4
                expect(result[3]).toBe 3
                expect(result[4]).toBe 2
                expect(result[5]).toBe 1
