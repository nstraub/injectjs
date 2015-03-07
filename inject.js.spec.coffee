describe 'injector', () ->
    describe 'register', () ->
        test_type = null
        test_result = null
        beforeEach () ->
            test_type = () ->
            test_result =
                name: 'test type',
                type: test_type,
                dependencies: null,
                lifetime: 'transient'
        afterEach () ->
            Injector.types = {};
            Injector.providers = {};

        describe 'register', () ->
            it 'registers a provided type', () ->
                Injector.register 'types', 'test type', ['test_dependency', test_type], 'singleton'
                test_result.dependencies = ['test_dependency']
                test_result.lifetime = 'singleton'
                expect(Injector.types['test type']).toEqual test_result

            it 'sets empty dependencies when type has no dependencies', () ->
                Injector.register 'types', 'test type', test_type, 'singleton'
                test_result.lifetime = 'singleton'
                expect(Injector.types['test type']).toEqual test_result
            it 'throws an error when no name is passed', () ->
                expect(() -> Injector.register('types', test_type)).toThrow 'Type must have a name'

            it 'throws an error when name is empty string', () ->
                expect(() -> Injector.register('types', '', test_type)).toThrow 'Type must have a name'

            it 'throws an error when no type is passed', () ->
                expect(() -> Injector.register('types', 'no type')).toThrow 'no type was passed'

            it 'throws an error when last item in type array isn`t a function', () ->
                expect(() -> Injector.register('types', 'no type', ['test dependency'])).toThrow 'no type was passed'

            it 'throws an error when an invalid where is passed', () ->
                expect(() -> Injector.register('invalid where', 'test type', test_type)).toThrow 'invalid destination "invalid where" provided. Valid destinations are types, providers, and main'

        describe 'registerType', () ->
            it 'registers a provided type', () ->
                Injector.registerType 'test type', test_type, 'singleton'
                test_result.lifetime = 'singleton'
                expect(Injector.types['test type']).toEqual test_result

            it 'defaults to transient lifetime', () ->
                Injector.registerType 'test type', ['test_dependency', test_type]
                test_result.dependencies = ['test_dependency']
                expect(Injector.types['test type']).toEqual test_result

            it 'throws an error when invalid lifetime is passed', () ->

                expect(() -> Injector.registerType('test type', test_type , 'invalid lifetime')).toThrow 'invalid lifetime "invalid lifetime" provided. Valid lifetimes are singleton, transient, instance and parent'

        describe 'registerProvider', () ->
            beforeEach () ->
                delete test_result.lifetime

            it 'registers a provider', () ->
                Injector.registerProvider 'test type', test_type
                expect(Injector.providers['test type']).toEqual test_result

        describe 'register main', () ->
            it 'registers the main entry point', () ->
                Injector.registerMain test_type
                test_result.name = 'main';
                delete test_result.lifetime;
                expect(Injector.providers['main']).toEqual test_result

    describe 'instantiate', () ->
        beforeEach () ->
            Injector.types =
                test:
                    name: 'test'
                    dependencies: null
                    type: class test_type
                        constructor: (@test_dependency) ->
                    lifetime: 'transient'
                test_dependency:
                    name: 'test_dependency'
                    dependencies: null
                    type: class test_dependency
                    lifetime: 'transient'
        it 'instantiates a given type', () ->
            test = Injector.instantiate 'test'
            expect(test instanceof Injector.types.test.type).toBeTruthy()

        it 'instantiates a given type`s dependencies', () ->
            Injector.types.test.dependencies = ['test_dependency']
            test = Injector.instantiate 'test'
            expect(test.test_dependency instanceof Injector.types.test_dependency.type).toBeTruthy()


    describe 'inject', () ->
        test_provider_spy = null
        test_provider_dependency_stub = null
        beforeEach () ->
            test_provider_spy = sinon.spy()
            test_provider_dependency_stub = sinon.stub()
            test_provider_dependency_stub.returns('test')
            Injector.types =
                test:
                    name: 'test'
                    dependencies: null
                    type: class test_type
                        constructor: (@test_dependency) ->
                    lifetime: 'transient'
                test_dependency:
                    name: 'test_dependency'
                    dependencies: null
                    type: class test_dependency
                    lifetime: 'transient'
            Injector.providers =
                test_provider:
                    name: 'test_provider'
                    dependencies: null
                    type: test_provider_spy
                    lifetime: 'transient'
                test_provider_dependency:
                    name: 'test_provider_dependency'
                    dependencies: null
                    type: test_provider_dependency_stub
                    lifetime: 'transient'

        it 'creates a function that returns an instance of the given type', () ->
            test = Injector.inject 'test'
            expect(test() instanceof Injector.types.test.type).toBeTruthy()

        it 'instantiates a given type`s dependencies', () ->
            Injector.types.test.dependencies = ['test_dependency']
            test = Injector.inject 'test'
            expect(test().test_dependency instanceof Injector.types.test_dependency.type).toBeTruthy()

        it 'creates a function that returns the given provider', () ->
            test = Injector.inject 'test_provider'
            test()
            expect(test_provider_spy).toHaveBeenCalledOnce()

        it 'injects dependencies into given provider', () ->
            Injector.providers.test_provider.dependencies = ['test_provider_dependency']
            test = Injector.inject 'test_provider'
            test()
            expect(test_provider_dependency_stub).toHaveBeenCalledOnce()
            expect(test_provider_spy).toHaveBeenCalledWith('test')

    describe 'lifetime', () ->
        describe 'singleton', () ->
            it 'creates one instance of the type per injector'
        describe 'transient', () ->
            it 'creates one instance of the type per dependency requirement'
        describe 'instance', () ->
            it 'creates one instance of the type per invocation of the inject function'
        describe 'parent', () ->
            it 'creates one instance of the type for a dependency and all of its dependencies'
            it 'creates a different instance of the type for a sibling dependency'