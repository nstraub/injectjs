injection_inject_spec = () ->
    test_provider_spy = null
    test_provider_dependency_stub = null
    beforeEach () ->
        test_provider_spy = sinon.spy()
        test_provider_dependency_stub = sinon.stub()
        test_provider_dependency_stub.returns('test')
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
        injector.providers =
            test_provider:
                name: 'test_provider'
                dependencies: null
                type: test_provider_spy
            test_provider_dependency:
                name: 'test_provider_dependency'
                dependencies: null
                type: test_provider_dependency_stub

    it 'creates a function that returns an instance of the given type', () ->
        test = injector.inject 'test'
        expect(test() instanceof injector.types.test.type).toBeTruthy()

    it 'instantiates a given type`s dependencies', () ->
        injector.types.test.dependencies = ['test_dependency']
        test = injector.inject 'test'
        expect(test().test_dependency instanceof injector.types.test_dependency.type).toBeTruthy()

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
        beforeEach () ->
            injector.fakes =
                test_provider:
                    name: 'test_provider'
                    dependencies: null
                    type: () ->
                    lifetime: 'transient'

                

        afterEach () ->
            injector.fakes = {}

        it 'prioritizes fakes over types and providers', () ->
            fake = injector.inject('test_provider')()

            expect(test_provider_spy).not.toHaveBeenCalled()

    it 'throws an error when provided dependency name isn`t registered', () ->
        expect(() ->
            injector.inject('nonexistent')).toThrow 'There is no dependency named "nonexistent" registered.'

    describe 'providers', () ->
        beforeEach () ->
            injector.providers =
                test_provider:
                    type: () -> return @
                    dependencies: null

        it 'gets a provider using caller`s context', () ->
            provider = injector.inject('test_provider').call(@)
            expect(provider).toBe @
