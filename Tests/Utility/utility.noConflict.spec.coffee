utility_no_conflict_spec = () ->
    beforeEach () ->
        @injector = window.injector

    afterEach () ->
        window.injector = @injector

    it 'restores old value of window.injector', () ->
        injector.noConflict()

        expect(injector).toBe 'test conflict injector'

    describe 'hide method', () ->
        beforeEach () ->
            sinon.spy(window, 'removeEventListener')

        afterEach () ->
            window.removeEventListener.restore()

        it 'de-registers hashchange event for clearing state', () ->
            injector.hide()

            expect(window.removeEventListener).toHaveBeenCalledWith('hashchange')
