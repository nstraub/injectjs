registration_register_main_spec = () ->
    beforeEach () ->
        setup.reset_injector(true)
    it 'registers the main entry point', () ->
        injector.registerMain @test_type
        @test_result.name = 'main';
        @test_result.lifetime = undefined;
        expect(injector.providers['main']).toEqual @test_result
