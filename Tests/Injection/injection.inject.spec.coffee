injection_inject_spec = () ->
    beforeEach () ->
        injector.types =
            test:
                name: 'test'
                dependencies: null
                type: class test_type
                    constructor: (@test_dependency) ->
                lifetime: 'transient'
            test_dependency:
                name: 'test_dependency'
                dependencies: null
                type: class test_dependency
                lifetime: 'transient'

    it 'creates a function that returns an instance of the given type', () ->
        test = injector.inject 'test'
        expect(test() instanceof injector.types.test.type).toBeTruthy()

    it 'instantiates a given type`s dependencies', () ->
        injector.types.test.dependencies = ['test_dependency']
        test = injector.inject 'test'
        expect(test().test_dependency instanceof injector.types.test_dependency.type).toBeTruthy()

    describe 'passive providers', () ->
        test_provider_spy = null
        beforeEach () ->
            provider_fn = (test_type) -> test_type
            test_provider_spy = sinon.spy provider_fn
            injector.types =
                test_type:
                    dependencies: null
                    type: () ->
                    lifetime: 'transient'
                    provider: 'test_provider'

            injector.providers =
                test_provider:
                    dependencies: ['test_type']
                    type: test_provider_spy

        it 'uses specified provider to instantiate type', () ->
            provider = injector.inject 'test_type'
            type = provider()

            expect(type).toBeInstanceOf injector.types.test_type.type
            expect(test_provider_spy).toHaveBeenCalledOnce()

            provider = injector.inject 'test_type'
            type = provider()

            expect(test_provider_spy).toHaveBeenCalledTwice()

        it 'caches the passive provider instead of the type', () ->
            provider = injector.inject('test_type')()
            provider = injector.inject 'test_type'
            type = provider()

            expect(type).toBeInstanceOf injector.types.test_type.type
            expect(test_provider_spy).toHaveBeenCalledTwice()


    describe 'anonymous types', () ->
        it 'injects dependencies into a function descriptor', () ->
            adhoc_function = (dependency) -> return dependency
            descriptor = ['test_dependency', adhoc_function]

            adhoc_function_provider = injector.inject descriptor

            expect(adhoc_function_provider()).toBeInstanceOf injector.types.test_dependency.type

        it 'injects dependencies into a function without a descriptor', () ->
            adhoc_function = (test_dependency) -> return test_dependency

            adhoc_function_provider = injector.inject adhoc_function

            expect(adhoc_function_provider()).toBeInstanceOf injector.types.test_dependency.type

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
            injector.providers =
                test_provider:
                    name: 'test_provider'
                    dependencies: null
                    type: test_provider_spy

                

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
                    type: () -> return @
                    dependencies: null

        it 'gets a provider using caller`s context', () ->
            provider = injector.inject('test_this_provider').call(@)
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

