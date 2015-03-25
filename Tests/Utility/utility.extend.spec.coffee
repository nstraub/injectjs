utility_extend_spec = () ->
    it 'extends a registered type with passed function', () ->
        injector.types =
            test:
                type: () ->
                dependencies: null

        new_type = () ->
        injector.extend('test', new_type)
        expect(new_type.prototype).toBeInstanceOf injector.types.test.type

    it 'throws an error when no type is found', () ->
        expect(() -> injector.extend('test', () ->)).toThrow 'No type "test" found.'
