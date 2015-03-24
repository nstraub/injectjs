injection_get_spec = () ->
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

    it 'instantiates a given type', () ->
        test = injector.get 'test'
        expect(test).toBeInstanceOf injector.types.test.type

    it 'instantiates a given type`s dependencies', () ->
        injector.types.test.dependencies = ['test_dependency']
        test = injector.get 'test'
        expect(test.test_dependency).toBeInstanceOf injector.types.test_dependency.type
