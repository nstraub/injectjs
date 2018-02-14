import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';

let injector;
export default () =>
    it('creates one instance of the type per injector', function() {
        injector = setup.reset_injector();
        setup.assign_base_types();

        const first_singleton_instance = injector.get('base_singleton_type');
        const second_singleton_instance = injector.get('base_singleton_type');

        expect(first_singleton_instance).toBeInstanceOf(injector.getType('base_singleton_type'));
        expect(second_singleton_instance).toBeInstanceOf(injector.getType('base_singleton_type'));
        return expect(first_singleton_instance).toBe(second_singleton_instance);
    })
;
