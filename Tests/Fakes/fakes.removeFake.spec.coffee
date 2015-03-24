fakes_remove_fake_spec = () ->
    beforeEach () ->
        @fake_type = () ->
        injector.fakes =
            test_fake:
                type: @fake_type
                lifetime: 'singleton'
            test_fake_two:
                type: () ->
                lifetime: 'transient'

    it 'removes requested fake', () ->
        injector.removeFake('test_fake_two')

        expect(injector.fakes).toEqual test_fake:
            type: @fake_type
            lifetime: 'singleton'

