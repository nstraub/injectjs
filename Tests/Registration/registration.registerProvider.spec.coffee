registration_register_provider_spec = () ->
    beforeEach () ->
        @test_result.lifetime = undefined;

    it 'registers a provider', () ->
        injector.registerProvider 'test type', @test_type
        expect(injector.providers['test type']).toEqual @test_result
