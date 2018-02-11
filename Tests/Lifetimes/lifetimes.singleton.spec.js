import injector from '../instantiate.injector';
import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';

export default () =>
    it('creates one instance of the type per injector', function() {
        const first_singleton_instance = injector.get('base_singleton_type');
        const second_singleton_instance = injector.get('base_singleton_type');

        expect(first_singleton_instance).toBeInstanceOf(injector.getType('base_singleton_type'));
        expect(second_singleton_instance).toBeInstanceOf(injector.getType('base_singleton_type'));
        return expect(first_singleton_instance).toBe(second_singleton_instance);
    })
;
