registration_register_fake_spec = () ->
    beforeEach () ->
        setup.reset_injector()
    it 'registers a provided fake', () ->
        injector.registerFake 'test type', @test_type, 'singleton'
        @test_result.lifetime = 'singleton'
        expect(injector.fakes['test type']).toEqual @test_result

    it 'defaults to transient lifetime', () ->
        injector.registerFake 'test type', ['test_dependency', @test_type]
        @test_result.dependencies = ['test_dependency']
        expect(injector.fakes['test type']).toEqual @test_result

    it 'throws an error when invalid lifetime is passed', () ->
        expect(() ->
            injector.registerFake('test type', @test_type,
              'invalid lifetime')).toThrow 'invalid lifetime "invalid lifetime" provided. Valid lifetimes are singleton, transient, instance and parent'
