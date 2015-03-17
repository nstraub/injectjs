registration_register_spec = () ->
    it 'registers a provided type', () ->
        injector.register 'types', 'test type', ['test_dependency', @test_type], 'singleton'
        @test_result.dependencies = ['test_dependency']
        @test_result.lifetime = 'singleton'
        expect(injector.types['test type']).toEqual @test_result

    it 'sets empty dependencies when type has no dependencies', () ->
        injector.register 'types', 'test type', @test_type, 'singleton'
        @test_result.lifetime = 'singleton'
        expect(injector.types['test type']).toEqual @test_result
    it 'throws an error when no name is passed', () ->
        expect(() -> injector.register('types', @test_type)).toThrow 'Type must have a name'

    it 'throws an error when name is empty string', () ->
        expect(() -> injector.register('types', '', @test_type)).toThrow 'Type must have a name'

    it 'throws an error when no type is passed', () ->
        expect(() -> injector.register('types', 'no type')).toThrow 'no type was passed'

    it 'throws an error when last item in type array isn`t a function', () ->
        expect(() -> injector.register('types', 'no type', ['test dependency'])).toThrow 'no type was passed'

    it 'throws an error when an invalid where is passed', () ->
        expect(() -> injector.register('invalid where', 'test type', @test_type)).toThrow 'invalid destination "invalid where" provided. Valid destinations are types, providers, fakes and main'

    it 'registers a provided fake', () ->
        injector.register('fakes', 'test type', @test_type, 'transient')

        expect(injector.fakes['test type']).toEqual @test_result
