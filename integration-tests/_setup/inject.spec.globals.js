import setup from './inject.spec.setup';
const lifetimes = ['transient', 'root', 'state', 'singleton', 'parent'];
let injector;
const get_adhoc_dependency_tests = lifetime =>{};
    /*function() {
        beforeEach(function() {
            injector = setup.reset_injector();

            setup.make_descriptor({
                name: 'test_type',
                type(adhoc_dependency) { this.adhoc_dependency = adhoc_dependency; },
                dependencies: ['adhoc_dependency'],
                lifetime
            });
            setup.make_descriptor({
                name: 'ordered_test_type',
                type(f, e, c, d, b, a) { this.f = f; this.e = e; this.c = c; this.d = d; this.b = b; this.a = a; },
                dependencies: ['f', 'e', 'c', 'd', 'b', 'a'],
                lifetime
            });
            setup.make_descriptor({
                name: 'type_with_no_dependencies',
                type() { return this.args = arguments; },
                lifetime
            });

            setup.make_descriptor({
                target: 'providers',
                name: 'a',
                type() { return 1; }
            });
            setup.make_descriptor({
                target: 'providers',
                name: 'c',
                type() { return 3; }
            });
            return setup.make_descriptor({
                target: 'providers',
                name: 'e',
                type() { return 5; }
            });
        });

        it('injects ad-hoc dependency at instantiation time', function() {
            const test = injector.inject('test_type');
            const result = test({adhoc_dependency: 'test dependency'});

            return expect(result.adhoc_dependency).toBe('test dependency');
        });

        it('maintains proper dependency order', function() {
            const test = injector.inject('ordered_test_type');
            const result = test({b: 2, d: 4, f: 6});

            expect(result.f).toBe(6);
            expect(result.e).toBe(5);
            expect(result.d).toBe(4);
            expect(result.c).toBe(3);
            expect(result.b).toBe(2);
            return expect(result.a).toBe(1);
        });

        it('passes ad-hoc dependencies up the dependency tree', function() {
            setup.make_descriptor({
                name: 'parent_adhoc_type',
                type(test_type, ordered_test_type) { this.test_type = test_type; this.ordered_test_type = ordered_test_type; },
                dependencies: ['test_type', 'ordered_test_type'],
                lifetime: 'transient'
            });

            let test_provider = injector.inject('parent_adhoc_type');

            let result = test_provider({b: 2, d: 4, f: 6, adhoc_dependency: 'test dependency'});

            expect(result.ordered_test_type).toBeInstanceOf(injector.types.ordered_test_type.type);
            expect(result.test_type).toBeInstanceOf(injector.types.test_type.type);

            test_provider = injector.inject('parent_adhoc_type');

            result = test_provider({b: 2, d: 4, f: 6, adhoc_dependency: 'test dependency'});

            expect(result.ordered_test_type).toBeInstanceOf(injector.types.ordered_test_type.type);
            return expect(result.test_type).toBeInstanceOf(injector.types.test_type.type);
        });


        return it('doesnt pass unwanted dependencies', function() {
            return expect(injector.get('type_with_no_dependencies', {adhoc: 1}).args.length, this).toBe(0);
        });
    };*/

export {lifetimes, get_adhoc_dependency_tests};
