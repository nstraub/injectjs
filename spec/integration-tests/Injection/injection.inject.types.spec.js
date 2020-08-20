import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';
import sinon                                          from 'sinon';


let injector;
export default function () {
    describe('basic types', function () {
        beforeAll(function () {
            injector = setup.reset_injector();
            setup.assign_base_types();
            return setup.assign_basic_dependent_types();
        });


        for (var lifetime of lifetimes) {
            (lifetime =>
                    it(`creates a function that returns an instance of ${lifetime}`, function () {
                        const type = `base_${lifetime}_type`;
                        const provider = injector.inject(type).provider;
                        return expect(provider())
                            .toBeInstanceOf(injector.getType(type));
                    })
            )(lifetime);
        }

        return (() => {
            const result = [];
            for (lifetime of lifetimes) {
                result.push(lifetimes.map((dependency_lifetime) =>
                    ((lifetime, dependency_lifetime) =>
                            it(`instantiates a ${lifetime} type that depends on a ${dependency_lifetime} type`, function () {
                                const test = injector.inject(lifetime + '_depends_on_' + dependency_lifetime).provider;
                                return expect(test().dependency)
                                    .toBeInstanceOf(injector.getType(`base_${dependency_lifetime}_type`));
                            })
                    )(lifetime, dependency_lifetime)));
            }
            return result;
        })();
    });

    describe('passive providers', function () {
        beforeEach(function () {
            injector = setup.reset_injector();
            return setup.assign_passive_types();
        });

        return lifetimes.map((lifetime) =>
            (function (lifetime) {
                it(`uses passive_${lifetime}_provider to instantiate passive_${lifetime}_type`, function () {
                    const provider = injector.inject(`passive_${lifetime}_type`).provider;
                    const type = provider();

                    expect(type)
                        .toBeInstanceOf(injector.getType(`passive_${lifetime}_type`));
                    return expect(type.passively_provided).toBeTruthy();
                });

                it(`caches the passive_${lifetime}_provider instead of passive_${lifetime}_type`, function () {
                    let provider = injector.inject(`passive_${lifetime}_type`).provider;
                    const type = provider();

                    expect(type)
                        .toBeInstanceOf(injector.getType(`passive_${lifetime}_type`));
                    expect(type.passively_provided).toBeTruthy();
                    type.passively_provided = false;

                    provider =
                        injector.inject(`passive_${lifetime}_type`).provider;
                    const type2 = provider();

                    expect(type2)
                        .toBeInstanceOf(injector.getType(`passive_${lifetime}_type`));
                    if (__in__(lifetime, ['singleton', 'state'])) {
                        expect(type).toBe(type2);
                    } else {
                        expect(type2.passively_provided).toBeTruthy();
                    }
                });

                it('allows the passive provider to be an anonymous function', function () {
                    const provider = injector.inject(`passive_${lifetime}_type_with_anon_provider`).provider;
                    const type = provider();

                    expect(type)
                        .toBeInstanceOf(injector.getType(`passive_${lifetime}_type_with_anon_provider`));
                    return expect(type.passively_provided).toBeTruthy();
                });

                return it('allows the passive provider to be an array with an anonymous function', function () {
                    const provider = injector.inject(`passive_${lifetime}_type_with_anon_array`).provider;
                    const type = provider();

                    expect(type)
                        .toBeInstanceOf(injector.getType(`passive_${lifetime}_type_with_anon_array`));
                    return expect(type.passively_provided).toBeTruthy();
                });
            })(lifetime));
    });


    /*
     describe('anonymous types', function() {
     beforeAll(function() {
     injector = setup.reset_injector();
     return setup.assign_base_types();
     });

     return (() => {
     const result = [];
     for (var lifetime of lifetimes) {
     (lifetime =>
     it(`injects base_${lifetime}_type into an ad-hoc function descriptor`, function() {
     const adhoc_function = dependency => dependency;
     const descriptor = [`base_${lifetime}_type`, adhoc_function];

     const adhoc_function_provider = injector.inject(descriptor);

     expect(adhoc_function_provider()).toBeInstanceOf(injector.getType(`base_${lifetime}_type`));

     })
     )(lifetime);
     result.push(it(`injects base_${lifetime}_type into a function without a descriptor`, function() {
     var adhoc_function;
     eval(`adhoc_function = function (base_${lifetime}_type){ return base_${lifetime}_type;}`);

     const adhoc_function_provider = injector.inject(adhoc_function);

     return expect(adhoc_function_provider()).toBeInstanceOf(injector.getType(`base_${lifetime}_type`));
     }));
     }
     return result;
     })();
     });

     describe('fakes', function() {
     let test_provider_spy = null;
     beforeEach(function() {
     test_provider_spy = sinon.spy();
     injector.fakes = {
     test_provider: {
     name: 'test_provider',
     dependencies: null,
     type() {},
     lifetime: 'transient',
     hashCode: setup.next_hash()
     }
     };
     return injector.providers = {
     test_provider: {
     name: 'test_provider',
     dependencies: null,
     type: test_provider_spy,
     hashCode: setup.next_hash()
     }
     };
     });



     afterEach(() => injector.fakes = {});

     return it('prioritizes fakes over types and providers', function() {
     const fake = injector.inject('test_provider')();

     return expect(test_provider_spy).not.toHaveBeenCalled();
     });
     });

     it('throws an error when provided dependency name isn`t registered', () =>
     expect(() => injector.inject('nonexistent')).toThrow('There is no dependency named "nonexistent" registered.')
     );

     it('throws an error when provided dependency has unregistered dependencies', () =>
     expect(() => injector.inject(nonexistent=> nonexistent)()).toThrow('There is no dependency named "nonexistent" registered.')
     );*/
};


function __in__(needle, haystack) {
    return Array.from(haystack).indexOf(needle) >= 0;
}
