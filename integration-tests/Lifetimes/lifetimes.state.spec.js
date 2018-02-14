
import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';

export default function() {
    it('creates one instance of the type per state', function() {
        const first_instance = injector.get('base_state_type');
        const second_instance = injector.get('base_state_type');

        expect(first_instance).toBeInstanceOf(injector.getType('base_state_type'));
        expect(second_instance).toBeInstanceOf(injector.getType('base_state_type'));
        return expect(first_instance).toBe(second_instance);
    });

    describe('clearState', function() {
        it('clears state objects', function() {
            const first_singleton_instance = injector.get('base_state_type');
            injector.clearState();
            const second_singleton_instance = injector.get('base_state_type');

            expect(first_singleton_instance).toBeInstanceOf(injector.getType('base_state_type'));
            expect(second_singleton_instance).toBeInstanceOf(injector.getType('base_state_type'));
            return expect(first_singleton_instance).not.toBe(second_singleton_instance);
        });

        return ['transient', 'root', 'state'].map((lifetime) =>
            (lifetime =>
                it(`gets new state provider on cached ${lifetime} objects`, function() {
                    const first = injector.get(lifetime + '_depends_on_state');
                    injector.clearState();

                    let second = null;
                    expect(() => second = injector.get(lifetime + '_depends_on_state')).not.toThrow();

                    return expect(first.dependency).not.toBe(second.dependency);
                })
            )(lifetime));
    });

    return describe('ad-hoc dependencies', get_adhoc_dependency_tests('state'));
};
