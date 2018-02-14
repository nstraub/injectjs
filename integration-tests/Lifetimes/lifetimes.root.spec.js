
import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';

export default  function() {
    beforeEach(function() {
        setup.make_descriptor({name: 'root_dependency', lifetime: 'root'});
        setup.make_descriptor({
            name: 'third_level_dependency',
            type(root) { this.root = root; },
            dependencies: ['root_dependency']
        });
        setup.make_descriptor({
            name: 'second_level_dependency',
            type(third) { this.third = third; },
            dependencies: ['third_level_dependency']
        });
        setup.make_descriptor({
            name: 'second_level_dependency2',
            type(third, root) { this.third = third; this.root = root; },
            dependencies: ['third_level_dependency', 'root_dependency']
        });
        return setup.make_descriptor({
            name: 'base_type',
            type(second, second2, second3) { this.second = second; this.second2 = second2; this.second3 = second3; },
            dependencies: ['second_level_dependency', 'second_level_dependency2', 'second_level_dependency2']
        });
    });

    it('creates one instance of the type per root invocation of the inject function', function() {
        let first = injector.inject('base_type');
        let second = injector.inject('second_level_dependency2');

        first = first();
        second = second();

        const first_root = first.second.third.root;
        expect(first.second2.root).toBe(first_root);
        expect(first.second2.third.root).toBe(first_root);
        expect(first.second3.root).toBe(first_root);
        expect(first.second3.third.root).toBe(first_root);

        const second_root = second.root;
        expect(second.third.root).toBe(second_root);
        return expect(first_root).not.toBe(second_root);
    });

    it('allows root lifetime types to be roots themselves', () => expect(() => injector.get('root_dependency')).not.toThrow());

    return describe('ad-hoc dependencies', get_adhoc_dependency_tests('root'));
};
