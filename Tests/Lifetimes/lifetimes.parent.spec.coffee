lifetimes_parent_spec = () ->
    beforeEach () ->
        setup.make_descriptor
            name: 'parent_dependency'
            lifetime: 'parent'
        setup.make_descriptor
            name: 'root_dependency'
            lifetime: 'root'
        setup.make_descriptor
            name: 'third_level_dependency'
            dependencies: ['parent_dependency']
            type: (@parent) -> return
        setup.make_descriptor
            name: 'third_level_dependency2'
            dependencies: ['parent_dependency', 'root_dependency']
            type: (@parent, @root) -> return
        setup.make_descriptor
            name: 'second_level_dependency'
            dependencies: ['third_level_dependency']
            type: (@third) -> return
        setup.make_descriptor
            name: 'second_level_dependency2'
            dependencies: ['third_level_dependency', 'parent_dependency']
            type: (@third, @parent) -> return
        setup.make_descriptor
            name: 'second_level_dependency3'
            dependencies: ['third_level_dependency2', 'root_dependency']
            type: (@third, @root) -> return
        setup.make_descriptor
            name: 'base_type'
            dependencies: ['second_level_dependency', 'second_level_dependency2', 'second_level_dependency2']
            type: (@second, @second2, @second3) -> return
        setup.make_descriptor
            name: 'base_parent_type'
            dependencies: ['second_level_dependency2', 'parent_dependency']
            type: (@second, @parent) -> return
        setup.make_descriptor
            name: 'base_type_with_roots'
            dependencies: ['second_level_dependency2', 'second_level_dependency3', 'third_level_dependency2']
            type: (@second2, @second3, @third) -> return

    it 'creates one instance of the type for its parent and all of its dependencies', () ->
        provider = injector.inject 'second_level_dependency2'
        type = provider()

        expect(type.parent).toBeInstanceOf(injector.getType('parent_dependency'))
        expect(type.third.parent).toBeInstanceOf(injector.getType('parent_dependency'))
        expect(type.parent).toBe(type.third.parent)

    it 'creates a different instance of the type for its parents siblings', () ->
        provider = injector.inject 'base_type'
        type = provider()

        expect(type.second.third.parent).toBeInstanceOf(injector.getType('parent_dependency'))
        expect(type.second2.third.parent).toBeInstanceOf(injector.getType('parent_dependency'))
        expect(type.second2.parent).toBeInstanceOf(injector.getType('parent_dependency'))
        expect(type.second3.third.parent).toBeInstanceOf(injector.getType('parent_dependency'))
        expect(type.second3.parent).toBeInstanceOf(injector.getType('parent_dependency'))

        expect(type.second2.third.parent).toBe(type.second2.parent)
        expect(type.second3.third.parent).toBe(type.second3.parent)
        expect(type.second.third.parent).not.toBe(type.second2.parent)
        expect(type.second.third.parent).not.toBe(type.second3.parent)
        expect(type.second2.parent).not.toBe(type.second3.parent)

    it 'references the topmost parent that contains the dependency', () ->
        provider = injector.inject 'base_parent_type'
        type = provider()

        expect(type.parent).toBe(type.second.third.parent)

    it 'doesn`t interfere with `root` lifetime types', () ->
        provider = injector.inject 'base_type_with_roots'
        type = provider()

        expect(type.second3.third.root).toBe(type.second3.root)
        expect(type.third.root).toBe(type.second3.root)

    describe 'ad-hoc dependencies', get_adhoc_dependency_tests('parent')
