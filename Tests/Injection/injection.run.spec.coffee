injection_run_spec = () ->
    afterEach () ->
        delete injector.providers.main
        
    it 'runs the main function', () ->
        test_main = sinon.spy()

        injector.providers.main =
            name: 'main',
            dependencies: null,
            type: test_main

        injector.run()

        expect(test_main).toHaveBeenCalledOnce()

    it 'throws a custom error when main provider doesn`t exist', () ->
        expect(() -> injector.run()).toThrow 'No main method registered. Please register one by running injector.registerMain() before running the app'
