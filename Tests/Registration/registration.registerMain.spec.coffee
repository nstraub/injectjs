registration_register_main_spec = () ->
    it 'registers the main entry point', () ->
        injector.registerMain @test_type
        @test_result.name = 'main';
        delete @test_result.lifetime;
        expect(injector.providers['main']).toEqual @test_result
