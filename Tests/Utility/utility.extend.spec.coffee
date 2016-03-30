utility_extend_spec = () ->
    beforeEach () ->
        setup.reset_injector()
        setup.assign_base_types()

    it 'extends a registered type with passed function', () ->
        new_type = () ->
        injector.extend('base_transient_type', new_type)
        expect(new_type.prototype).toBeInstanceOf injector.types.base_transient_type.type

    it 'throws an error when no type is found', () ->
        expect(() -> injector.extend('test', () ->)).toThrow 'No type "test" found.'

    for lifetime in lifetimes when lifetime isnt 'transient'
        do () ->
            it 'throws an error when type lifetime is ' + lifetime, () ->
                expect(() -> injector.extend('base_' + lifetime + '_type', () ->)).toThrow 'Only transient lifetime types are allowed for now'

