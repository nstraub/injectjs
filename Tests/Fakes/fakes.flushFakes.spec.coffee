fakes_flush_fakes_spec = () ->
    beforeEach () ->
        injector.fakes =
            test_fake:
                type: () ->
                lifetime: 'singleton'
            test_fake_two:
                type: () ->
                lifetime: 'transient'

    it 'removes all registered fakes', () ->
        injector.flushFakes()

        expect(injector.fakes).toEqual {}
