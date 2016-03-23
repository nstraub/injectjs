registration_register_spec = () ->
    it 'registers a provided type', () ->
        injector.registerType 'test type', ['test_dependency', @test_type], 'singleton'
        @test_result.dependencies = ['test_dependency']
        @test_result.lifetime = 'singleton'
        expect(injector.types['test type']).toEqual @test_result

    it 'assigns a hash code to every registered type', () ->
        injector.registerType('test_type_1', () -> return)
        injector.registerType('test_type_2', () -> return)
        injector.registerType('test_type_3', () -> return)

        expect(injector.types.test_type_1.hashCode).toBe 1
        expect(injector.types.test_type_2.hashCode).toBe 2
        expect(injector.types.test_type_3.hashCode).toBe 3

        expect(injector.currentHashCode).toBe 4

    it 'sets empty dependencies when type has no dependencies', () ->
        injector.registerType 'test type', @test_type, 'singleton'
        @test_result.lifetime = 'singleton'
        expect(injector.types['test type']).toEqual @test_result
    it 'throws an error when no name is passed', () ->
        expect(() -> injector.registerType(@test_type)).toThrow 'Type must have a name'

    it 'throws an error when name is empty string', () ->
        expect(() -> injector.registerType('', @test_type)).toThrow 'Type must have a name'

    it 'throws an error when no type is passed', () ->
        expect(() -> injector.registerType('no type')).toThrow 'no type was passed'

    it 'throws an error when last item in type array isn`t a function', () ->
        expect(() -> injector.registerType('no type', ['test dependency'])).toThrow 'no type was passed'

    it 'throws an error when type isn`t a function nor an array', () ->
        expect(() -> injector.registerType('no type', 'invalid type')).toThrow 'type must be a function or an array'

    it 'throws an error when an invalid where is passed', () ->
        expect(() -> injector._register('invalid where', 'test type', @test_type)).toThrow 'invalid destination "invalid where" provided. Valid destinations are types, providers, fakes and main'

    describe 'without a dependency array', () ->
        it 'registers dependencies for a type with one dependency', () ->
            @test_type = (test_dependency) ->
            @test_result.type = @test_type
            @test_result.dependencies = ['test_dependency']
            @test_result.lifetime = 'singleton'

            injector.registerType 'test type', @test_type, 'singleton'
            expect(injector.types['test type']).toEqual @test_result

        it 'registers dependencies for a type with two dependencies', () ->
            @test_type = (test_dependency, test_dependency_2) ->
            @test_result.type = @test_type
            @test_result.dependencies = ['test_dependency', 'test_dependency_2']
            @test_result.lifetime = 'singleton'

            injector.registerType 'test type', @test_type, 'singleton'
            expect(injector.types['test type']).toEqual @test_result

        it 'registers dependencies for a type with three dependencies', () ->
            @test_type = (test_dependency, test_dependency_2, test_dependency_3) ->
            @test_result.type = @test_type
            @test_result.dependencies = ['test_dependency', 'test_dependency_2', 'test_dependency_3']
            @test_result.lifetime = 'singleton'

            injector.registerType 'test type', @test_type, 'singleton'
            expect(injector.types['test type']).toEqual @test_result

        it 'registers no dependencies for a type with a nested function with parameters', () ->
            @test_type = () -> (nested_parameter) ->
            @test_result.type = @test_type
            @test_result.lifetime = 'singleton'

            injector.registerType 'test type', @test_type, 'singleton'
            expect(injector.types['test type']).toEqual @test_result

        it 'allows types to be named functions', () ->
            @test_type = `function Test(test_dependency, test_dependency_2) {}`
            @test_result.type = @test_type
            @test_result.dependencies = ['test_dependency', 'test_dependency_2']
            @test_result.lifetime = 'singleton'

            injector.registerType 'test type', @test_type, 'singleton'
            expect(injector.types['test type']).toEqual @test_result

    describe 'using $inject property', () ->
        it 'registers type names correctly', () ->
            @test_type = (a, b) ->
            @test_type.$inject = ['test_dependency', 'test_dependency_2']
            @test_result.type = @test_type
            @test_result.dependencies = ['test_dependency', 'test_dependency_2']
            @test_result.lifetime = 'singleton'

            injector.registerType 'test type', @test_type, 'singleton'
            expect(injector.types['test type']).toEqual @test_result

        it 'throws an error when both array notation and the $inject property are present', () ->
            @test_type = (a, b) ->

            array_notation = ['test_dependency', 'test_dependency_2', @test_type]
            array_notation.$inject = ['test_dependency', 'test_dependency_2']

            expect(() => injector.registerType('test type', array_notation, 'singleton')).toThrow(
              'passed type cannot have both array notation and the $inject property populated')

        it 'throws an error when both array notation and Type.$inject property are present', () ->
            @test_type = (a, b) ->
            @test_type.$inject = ['test_dependency', 'test_dependency_2']

            array_notation = ['test_dependency', 'test_dependency_2', @test_type]

            expect(() => injector.registerType('test type', array_notation, 'singleton')).toThrow(
              'passed type cannot have both array notation and the $inject property populated')
