lifetimes_root_spec = () ->
    beforeEach () ->
        setup.make_descriptor(name: 'root_dependency', lifetime: 'root')
        setup.make_descriptor(
            name: 'third_level_dependency',
            type: (@root) -> return,
            dependencies: ['root_dependency']
        )
        setup.make_descriptor(
            name: 'second_level_dependency'
            type: (@third) -> return
            dependencies: ['third_level_dependency']
        )
        setup.make_descriptor(
            name: 'second_level_dependency2'
            type: (@third, @root) -> return
            dependencies: ['third_level_dependency', 'root_dependency']
        )
        setup.make_descriptor(
            name: 'base_type'
            type: (@second, @second2, @second3) -> return
            dependencies: ['second_level_dependency', 'second_level_dependency2', 'second_level_dependency2']
        )

    it 'creates one instance of the type per root invocation of the inject function', () ->
        first = injector.inject('base_type')
        second = injector.inject('second_level_dependency2')
        
        first = first()
        second = second()

        first_root = first.second.third.root
        expect(first.second2.root).toBe(first_root)
        expect(first.second2.third.root).toBe(first_root)
        expect(first.second3.root).toBe(first_root)
        expect(first.second3.third.root).toBe(first_root)

        second_root = second.root
        expect(second.third.root).toBe(second_root)
        expect(first_root).not.toBe(second_root)

    it 'allows root lifetime types to be roots themselves', () ->
        expect(() -> injector.get('root_dependency')).not.toThrow();

    describe 'ad-hoc dependencies', get_adhoc_dependency_tests('root')
