injection_instantiate_spec = () ->
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
        test = injector.instantiate 'test'
        expect(test instanceof injector.types.test.type).toBeTruthy()

    it 'instantiates a given type`s dependencies', () ->
        injector.types.test.dependencies = ['test_dependency']
        test = injector.instantiate 'test'
        expect(test.test_dependency instanceof injector.types.test_dependency.type).toBeTruthy()
