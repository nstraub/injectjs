injection_get_spec = () ->
    beforeEach () ->
        setup.reset_injector()
        @test_provider = sinon.spy()

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
                dependencies: null
                type: @test_provider

    it 'instantiates a given type', () ->
        test = injector.get 'test'
        expect(test).toBeInstanceOf injector.types.test.type

    it 'instantiates a given type`s dependencies', () ->
        injector.types.test.dependencies = ['test_dependency']
        test = injector.get 'test'
        expect(test.test_dependency).toBeInstanceOf injector.types.test_dependency.type

    it 'applies a context when provided', () ->
        injector.get('test_provider', @)
        expect(@test_provider).toHaveBeenCalledOn @
