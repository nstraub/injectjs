import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';
import sinon from 'sinon';
import * as buildProviderModule from '../../../src/providers/build-provider'


let injector;
export default function() {
    let bpSpy;
    beforeEach(function() {
        injector = setup.reset_injector();
        setup.assign_base_types();
        setup.assign_basic_dependent_types();
        bpSpy = sinon.spy(buildProviderModule, 'default');
    });

    afterEach(function () {
        bpSpy.restore();
    });

    describe('basic dependency-less caching', () =>
        lifetimes.map((lifetime) =>
            (function(lifetime) {
                const type = `base_${lifetime}_type`;
                it(`caches ${type}`, function() {
                    const first_type = injector.inject(type).provider();

                    const second_type = injector.inject(type).provider();

                    const third_type = injector.inject(type).provider();

                    expect(first_type).toBeInstanceOf(injector.getType(type));
                    expect(second_type).toBeInstanceOf(injector.getType(type));
                    expect(third_type).toBeInstanceOf(injector.getType(type));

                    expect(bpSpy).toHaveBeenCalledOnce();
                });
            })(lifetime))
    );

    return describe('basic one-level dependency caching', () =>
        lifetimes.map((lifetime) =>
            lifetimes.map((dependency_lifetime) =>
                (function(lifetime, dependency_lifetime) {
                    const type = lifetime + '_depends_on_' + dependency_lifetime;
                    it(`caches ${type}`, function() {
                        const first_type = injector.inject(type).provider();

                        const second_type = injector.inject(type).provider();

                        const third_type = injector.inject(type).provider();

                        expect(first_type).toBeInstanceOf(injector.getType(type));
                        expect(second_type).toBeInstanceOf(injector.getType(type));
                        expect(third_type).toBeInstanceOf(injector.getType(type));

                        return expect(bpSpy).toHaveBeenCalledTwice();
                    });

                    if (!(__in__(lifetime, ['state', 'singleton']) || __in__(dependency_lifetime, ['state', 'singleton']))) {
                        return it(lifetime + ' discards stale base_' + dependency_lifetime + '_type', function() {
                            const first = injector.get(type);
                            injector.registerType(`base_${dependency_lifetime}_type`, (function(){}), dependency_lifetime);
                            const second = injector.get(type);

                            return expect(second.dependency).toBeInstanceOf(injector.getType(`base_${dependency_lifetime}_type`));
                        });
                    }
                })(lifetime, dependency_lifetime)))
    );
};

function __in__(needle, haystack) {
  return Array.from(haystack).indexOf(needle) >= 0;
}
