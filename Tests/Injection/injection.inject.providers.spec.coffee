injection_inject_providers_spec = () ->
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
            adhoc_test_provider:
                name: 'adhoc_test_provider'
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
            adhoc_ordered_test_provider:
                name: 'adhoc_ordered_test_provider'
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

    describe 'ad-hoc dependencies', () ->
        it 'injects adhoc dependency at instantiation time', () ->
            test = injector.inject 'adhoc_test_provider'
            result = test(adhoc_dependency: 'test dependency')

            expect(result[1]).toBe 'test dependency'

        it 'maintains proper dependency order', () ->
            test = injector.inject 'adhoc_ordered_test_provider'
            result = test({b:2,d:4,f:6})

            expect(result[0]).toBe 6
            expect(result[1]).toBe 5
            expect(result[2]).toBe 4
            expect(result[3]).toBe 3
            expect(result[4]).toBe 2
            expect(result[5]).toBe 1

    it 'passes ad-hoc dependencies up the dependency tree', () ->
        injector.types.parent_adhoc_provider =
            name: 'parent_adhoc_provider'
            type: (adhoc_test_provider, adhoc_ordered_test_provider) -> return {p: adhoc_test_provider, op: adhoc_ordered_test_provider}
            dependencies: ['adhoc_test_provider', 'adhoc_ordered_test_provider']

        test_provider = injector.inject 'parent_adhoc_provider'

        provider = test_provider({b: 2, d: 4, f: 6, adhoc_dependency: 'test dependency'})

        result = provider.op
        expect(result[0]).toBe 6
        expect(result[1]).toBe 5
        expect(result[2]).toBe 4
        expect(result[3]).toBe 3
        expect(result[4]).toBe 2
        expect(result[5]).toBe 1

        result = provider.p
        expect(result[1]).toBe 'test dependency'
