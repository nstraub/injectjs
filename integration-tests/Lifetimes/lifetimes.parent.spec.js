import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';

let injector;
export default function() {
    beforeEach(function() {
        injector = setup.reset_injector();
        setup.make_descriptor({
            name: 'base_type',
            type: function (second, second2, second3) { this.second = second; this.second2 = second2; this.second3 = second3; },
            dependencies: [
                'second_level_dependency',
                'second_level_dependency2',
                'second_level_dependency2'
            ]
        });
        setup.make_descriptor({
            name: 'parent_dependency',
            lifetime: 'parent'
        });
        setup.make_descriptor({
            name: 'root_dependency',
            lifetime: 'root'
        });
        setup.make_descriptor({
            name: 'third_level_dependency',
            dependencies: ['parent_dependency'],
            type(parent_dependency) { this.parent = parent_dependency; }
        });
        setup.make_descriptor({
            name: 'third_level_dependency2',
            dependencies: ['parent_dependency', 'root_dependency'],
            type(parent_dependency, root_dependency) { this.parent_dependency = parent; this.root = root_dependency; }
        });
        setup.make_descriptor({
            name: 'second_level_dependency',
            dependencies: ['third_level_dependency'],
            type(third_level_dependency) { this.third = third_level_dependency; }
        });
        setup.make_descriptor({
            name: 'second_level_dependency2',
            dependencies: ['third_level_dependency', 'parent_dependency'],
            type(third_level_dependency, parent_dependency) { this.third = third_level_dependency; this.parent = parent_dependency; }
        });
        setup.make_descriptor({
            name: 'second_level_dependency3',
            dependencies: ['third_level_dependency2', 'root_dependency'],
            type(third_level_dependency2, root_dependency) { this.third = third_level_dependency2; this.root = root_dependency; }
        });
        setup.make_descriptor({
            name: 'base_parent_type',
            dependencies: ['second_level_dependency2', 'parent_dependency'],
            type(second_level_dependency2, parent_dependency) { this.second = second_level_dependency2; this.parent = parent_dependency; }
        });
        return setup.make_descriptor({
            name: 'base_type_with_roots',
            dependencies: ['second_level_dependency2', 'second_level_dependency3', 'third_level_dependency2'],
            type(second_level_dependency2, second_level_dependency3, third_level_dependency2) { this.second2 = second_level_dependency2; this.second3 = second_level_dependency3; this.third = third_level_dependency2; }
        });
    });

    it('creates one instance of the type for its parent and all of its dependencies', function() {
        const provider = injector.inject('second_level_dependency2').provider;
        const type = provider();

        expect(type.parent).toBeInstanceOf(injector.getType('parent_dependency'));
        expect(type.third.parent).toBeInstanceOf(injector.getType('parent_dependency'));
        return expect(type.parent).toBe(type.third.parent);
    });

    it('creates a different instance of the type for its parents siblings', function() {
        const provider = injector.inject('base_type').provider;
        const type = provider();

        expect(type.second.third.parent).toBeInstanceOf(injector.getType('parent_dependency'));
        expect(type.second2.third.parent).toBeInstanceOf(injector.getType('parent_dependency'));
        expect(type.second2.parent).toBeInstanceOf(injector.getType('parent_dependency'));
        expect(type.second3.third.parent).toBeInstanceOf(injector.getType('parent_dependency'));
        expect(type.second3.parent).toBeInstanceOf(injector.getType('parent_dependency'));

        expect(type.second2.third.parent).toBe(type.second2.parent, 'expect(type.second2.third.parent).toBe(type.second2.parent)');
        expect(type.second3.third.parent).toBe(type.second3.parent, 'expect(type.second3.third.parent).toBe(type.second3.parent)');
        expect(type.second.third.parent).not.toBe(type.second2.parent, 'expect(type.second.third.parent).not.toBe(type.second2.parent)');
        expect(type.second.third.parent).not.toBe(type.second3.parent, 'expect(type.second.third.parent).not.toBe(type.second3.parent)');
        return expect(type.second2.parent).not.toBe(type.second3.parent, 'expect(type.second2.parent).not.toBe(type.second3.parent)');
    });

    it('references the topmost parent that contains the dependency', function() {
        const provider = injector.inject('base_parent_type').provider;
        const type = provider();

        return expect(type.parent).toBe(type.second.third.parent);
    });

    it('doesn`t interfere with `root` lifetime types', function() {
        const provider = injector.inject('base_type_with_roots').provider;
        const type = provider();

        expect(type.second3.third.root).toBe(type.second3.root);
        return expect(type.third.root).toBe(type.second3.root);
    });

    //describe('ad-hoc dependencies', get_adhoc_dependency_tests('parent'));
};
