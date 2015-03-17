utility_get_type_spec = () ->
    beforeEach () ->
        injector.types =
            test:
                name: 'test'
                dependencies: null
                type: class test_type
                    constructor: (@test_dependency) ->
                lifetime: 'transient'

    it 'gets the type for a requested dependency', () ->
        expect(injector.getType('test')).toBe injector.types.test.type

    it 'returns null when requested dependency isn`t registered', () ->
        expect(injector.getType('nothing')).toBeNull()

    it 'prioritizes fakes over types', () ->
        injector.fakes =
            test:
                name: 'test'
                dependencies: null
                type: class fake_type
                    constructor: (@test_dependency) ->
                lifetime: 'transient'

        expect(injector.getType('test')).toBe injector.fakes.test.type

        injector.fakes = {}
