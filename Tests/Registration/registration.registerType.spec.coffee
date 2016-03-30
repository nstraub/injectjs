registration_register_type_spec = () ->
    beforeEach () ->
        setup.reset_injector()
    it 'registers a provided type', () ->
        injector.registerType 'test type', @test_type, 'singleton'
        @test_result.lifetime = 'singleton'
        expect(injector.types['test type']).toEqual @test_result

    it 'defaults to transient lifetime', () ->
        injector.registerType 'test type', ['test_dependency', @test_type]
        @test_result.dependencies = ['test_dependency']
        expect(injector.types['test type']).toEqual @test_result

    it 'registers a provider for the type when specified', () ->
        type = () ->
        injector.registerType 'test type', type, null, 'test_provider'
        @test_result.type = type
        @test_result.lifetime = 'transient'
        @test_result.provider = 'test_provider'

        expect(injector.types['test type']).toEqual @test_result

    it 'throws an error when invalid lifetime is passed', () ->
        expect(() ->
            injector.registerType('test type', @test_type,
              'invalid lifetime')).toThrow 'invalid lifetime "invalid lifetime" provided. Valid lifetimes are singleton, transient, instance and parent'
