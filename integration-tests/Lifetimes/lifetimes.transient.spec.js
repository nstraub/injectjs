import injector from '../instantiate.injector';
import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';

export default function() {
    it('creates one instance of the type per dependency requirement', function() {
        const first_transient_instance = injector.get('base_transient_type');
        const second_transient_instance = injector.get('base_transient_type');

        return expect(first_transient_instance).not.toBe(second_transient_instance);
    });

    it('creates one instance of the type per dependency requirement when they are part of a parent dependency', function() {
        const instantiator = injector.inject('transient_depends_on_transient');
        const first_test_instance = instantiator();
        const second_test_instance = instantiator();

        return expect(first_test_instance.dependency).not.toBe(second_test_instance.dependency);
    });

    it('allows multiple instances of the same type to be injected into one dependant', function() {
        injector.types.multiple_instances = {
            name: 'multiple_instances',
            type(a, b) { this.a = a; this.b = b; },
            dependencies: ['base_transient_type', 'base_transient_type'],
            lifetime: 'transient'
        };

        const instance = injector.get('multiple_instances');

        expect(instance.a).toBeDefined();
        expect(instance.b).toBeDefined();
        return expect(instance.a).not.toBe(instance.b);
    });


    return describe('ad-hoc dependencies', get_adhoc_dependency_tests('transient'));
};
