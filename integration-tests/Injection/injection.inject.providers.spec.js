import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';
import sinon                                          from 'sinon';


let injector;
export default function () {
    let test_provider_spy = null;
    let test_provider_dependency_stub = null;

    beforeEach(function () {
        injector = setup.reset_injector();
        test_provider_spy = sinon.spy();
        test_provider_dependency_stub = sinon.stub();
        test_provider_dependency_stub.returns('test');
        injector.registerProvider('test_provider', test_provider_spy);
        injector.registerProvider('test_provider_dependency', test_provider_dependency_stub);
        injector.registerProvider('test_this_provider', function () {
            return this;
        });
        injector.registerProvider('adhoc_test_provider', function (test_provider_dependency, adhoc_dependency) {
            return [test_provider_dependency, adhoc_dependency];
        });
        injector.registerProvider('a', function () {
            return 1;
        });
        injector.registerProvider('c', function () {
            return 3;
        });
        injector.registerProvider('e', function () {
            return 5;
        });
        injector.registerProvider('adhoc_ordered_test_provider', function (f, e, c, d, b, a) {
            return [f, e, d, c, b, a];
        });
    });

    it('gets a provider using caller`s context', function () {
        const provider = injector.inject('test_this_provider')
            .provider
            .call(this);
        return expect(provider).toBe(this);
    });

    it('gets a nested provider using caller`s context', function () {
        injector.registerProvider('test_provider', function (test_this_provider) {
            return test_this_provider;
        });

        const provider = injector.inject('test_provider').provider.call(this);
        return expect(provider).toBe(this);
    });

    it('creates a function that returns the given provider', function () {
        const test = injector.inject('test_provider').provider;
        test();
        return expect(test_provider_spy).toHaveBeenCalledOnce();
    });

    it('injects dependencies into given provider', function () {
        injector.registerProvider('test_provider', [
            'test_provider_dependency',
            test_provider_spy
        ]);

        const test = injector.inject('test_provider').provider;
        test();
        expect(test_provider_dependency_stub).toHaveBeenCalledOnce();
        return expect(test_provider_spy).toHaveBeenCalledWith('test');
    });

    describe('ad-hoc dependencies', function () {
        it('injects adhoc dependency at instantiation time', function () {
            const test = injector.inject('adhoc_test_provider').provider;
            const result = test({adhoc_dependency: 'test dependency'});

            return expect(result[1]).toBe('test dependency');
        });

        return it('maintains proper dependency order', function () {
            const test = injector.inject('adhoc_ordered_test_provider').provider;
            const result = test({b: 2, d: 4, f: 6});

            expect(result[0]).toBe(6);
            expect(result[1]).toBe(5);
            expect(result[2]).toBe(4);
            expect(result[3]).toBe(3);
            expect(result[4]).toBe(2);
            expect(result[5]).toBe(1);
        });
    });

    return it('passes ad-hoc dependencies up the dependency tree', function () {
        setup.make_descriptor({
            name: 'parent_adhoc_provider',
            type: function (adhoc_test_provider, adhoc_ordered_test_provider) {
                this.p = adhoc_test_provider;
                this.op = adhoc_ordered_test_provider;
            },
            dependencies: ['adhoc_test_provider', 'adhoc_ordered_test_provider']
        });

        const test_provider = injector.inject('parent_adhoc_provider').provider;

        const provider = test_provider({
            b: 2,
            d: 4,
            f: 6,
            adhoc_dependency: 'test dependency'
        });

        let result = provider.op;
        expect(result[0]).toBe(6);
        expect(result[1]).toBe(5);
        expect(result[2]).toBe(4);
        expect(result[3]).toBe(3);
        expect(result[4]).toBe(2);
        expect(result[5]).toBe(1);

        result = provider.p;
        expect(result[1]).toBe('test dependency');
    });
}
