
import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';
import sinon from 'sinon';
let injector;
export default function() {
    beforeEach(function() {
        injector = setup.reset_injector();
        setup.assign_base_types();
        setup.assign_basic_dependent_types();
    });

    describe('basic dependency-less caching', () =>
        lifetimes.map((lifetime) =>
            (function(lifetime) {
                const type = `base_${lifetime}_type`;
                return it(`caches ${type}`, function() {
                    const first_type = injector.inject(type)();

                    const second_type = injector.inject(type)();

                    const third_type = injector.inject(type)();

                    expect(first_type).toBeInstanceOf(injector.getType(type));
                    expect(second_type).toBeInstanceOf(injector.getType(type));
                    expect(third_type).toBeInstanceOf(injector.getType(type));

                    return expect(injector._build_provider).toHaveBeenCalledOnce();
                });
            })(lifetime))
    );

    return describe('basic one-level dependency caching', () =>
        lifetimes.map((lifetime) =>
            lifetimes.map((dependency_lifetime) =>
                (function(lifetime, dependency_lifetime) {
                    const type = lifetime + '_depends_on_' + dependency_lifetime;
                    it(`caches ${type}`, function() {
                        const first_type = injector.inject(type)();

                        const second_type = injector.inject(type)();

                        const third_type = injector.inject(type)();

                        expect(first_type).toBeInstanceOf(injector.getType(type));
                        expect(second_type).toBeInstanceOf(injector.getType(type));
                        expect(third_type).toBeInstanceOf(injector.getType(type));

                        return expect(injector._build_provider).toHaveBeenCalledTwice();
                    });

                    if (!(__in__(lifetime, ['state', 'singleton']) || __in__(dependency_lifetime, ['state', 'singleton']))) {
                        return it(lifetime + ' discards stale base_' + dependency_lifetime + '_type', function() {
                            const first = injector.get(type);
                            injector.registerType(`base_${dependency_lifetime}_type`, (function(){}), dependency_lifetime);
                            const second = injector.get(type);

                            return expect(second.dependency).toBeInstanceOf(injector.types[`base_${dependency_lifetime}_type`].type);
                        });
                    }
                })(lifetime, dependency_lifetime)))
    );
};

function __in__(needle, haystack) {
  return Array.from(haystack).indexOf(needle) >= 0;
}
