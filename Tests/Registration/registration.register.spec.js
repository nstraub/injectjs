import injector from '../instantiate.injector';
import {setup} from '../_setup';

export default function() {
    beforeEach(() => setup.reset_injector());

    it('registers a provided type', function() {
        injector.registerType('test type', ['test_dependency', this.test_type], 'singleton');
        this.test_result.dependencies = ['test_dependency'];
        this.test_result.lifetime = 'singleton';
        return expect(injector.types['test type']).toEqual(this.test_result);
    });

    it('assigns a hash code to every registered type', function() {
        injector.registerType('test_type_1', function() {  });
        injector.registerType('test_type_2', function() {  });
        injector.registerType('test_type_3', function() {  });

        expect(injector.types.test_type_1.hashCode).toBe(1);
        expect(injector.types.test_type_2.hashCode).toBe(2);
        expect(injector.types.test_type_3.hashCode).toBe(3);

        return expect(injector.currentHashCode).toBe(4);
    });

    it('sets empty dependencies when type has no dependencies', function() {
        injector.registerType('test type', this.test_type, 'singleton');
        this.test_result.lifetime = 'singleton';
        return expect(injector.types['test type']).toEqual(this.test_result);
    });
    it('throws an error when no name is passed', function() {expect(() =>  injector.registerType(this.test_type)).toThrow('Type must have a name');});

    it('throws an error when name is empty string', function () {expect(() => injector.registerType('', this.test_type)).toThrow('Type must have a name');});

    it('throws an error when no type is passed', function () {
        return expect(() => injector.registerType('no type')).toThrow('no type was passed');
    });

    it('throws an error when last item in type array isn`t a function', () => expect(() => injector.registerType('no type', ['test dependency'])).toThrow('no type was passed'));

    it('throws an error when type isn`t a function nor an array', () => expect(() => injector.registerType('no type', 'invalid type')).toThrow('type must be a function or an array'));

    it('throws an error when an invalid where is passed', function () {
        expect(() => {
            injector._register('invalid where', 'test type', this.test_type);
        }).toThrow('invalid destination "invalid where" provided. Valid destinations are types, providers and fakes');
    });

    describe('without a dependency array', function() {
        it('registers dependencies for a type with one dependency', function() {
            this.test_type = function(test_dependency) {};
            this.test_result.type = this.test_type;
            this.test_result.dependencies = ['test_dependency'];
            this.test_result.lifetime = 'singleton';

            injector.registerType('test type', this.test_type, 'singleton');
            return expect(injector.types['test type']).toEqual(this.test_result);
        });

        it('registers dependencies for a type with two dependencies', function() {
            this.test_type = function(test_dependency, test_dependency_2) {};
            this.test_result.type = this.test_type;
            this.test_result.dependencies = ['test_dependency', 'test_dependency_2'];
            this.test_result.lifetime = 'singleton';

            injector.registerType('test type', this.test_type, 'singleton');
            return expect(injector.types['test type']).toEqual(this.test_result);
        });

        it('registers dependencies for a type with three dependencies', function() {
            this.test_type = function(test_dependency, test_dependency_2, test_dependency_3) {};
            this.test_result.type = this.test_type;
            this.test_result.dependencies = ['test_dependency', 'test_dependency_2', 'test_dependency_3'];
            this.test_result.lifetime = 'singleton';

            injector.registerType('test type', this.test_type, 'singleton');
            return expect(injector.types['test type']).toEqual(this.test_result);
        });

        it('registers no dependencies for a type with a nested function with parameters', function() {
            this.test_type = () => function(nested_parameter) {};
            this.test_result.type = this.test_type;
            this.test_result.lifetime = 'singleton';

            injector.registerType('test type', this.test_type, 'singleton');
            return expect(injector.types['test type']).toEqual(this.test_result);
        });

        return it('allows types to be named functions', function() {
            this.test_type = function Test(test_dependency, test_dependency_2) {};
            this.test_result.type = this.test_type;
            this.test_result.dependencies = ['test_dependency', 'test_dependency_2'];
            this.test_result.lifetime = 'singleton';

            injector.registerType('test type', this.test_type, 'singleton');
            return expect(injector.types['test type']).toEqual(this.test_result);
        });
    });

    return describe('using $inject property', function() {
        it('registers type names correctly', function() {
            this.test_type = function(a, b) {};
            this.test_type.$inject = ['test_dependency', 'test_dependency_2'];
            this.test_result.type = this.test_type;
            this.test_result.dependencies = ['test_dependency', 'test_dependency_2'];
            this.test_result.lifetime = 'singleton';

            injector.registerType('test type', this.test_type, 'singleton');
            return expect(injector.types['test type']).toEqual(this.test_result);
        });

        it('throws an error when both array notation and the $inject property are present', function() {
            this.test_type = function(a, b) {};

            const array_notation = ['test_dependency', 'test_dependency_2', this.test_type];
            array_notation.$inject = ['test_dependency', 'test_dependency_2'];

            return expect(() => injector.registerType('test type', array_notation, 'singleton')).toThrow(
              'passed type cannot have both array notation and the $inject property populated');
        });

        it('throws an error when both array notation and Type.$inject property are present', function() {
            this.test_type = function(a, b) {};
            this.test_type.$inject = ['test_dependency', 'test_dependency_2'];

            const array_notation = ['test_dependency', 'test_dependency_2', this.test_type];

            return expect(() => injector.registerType('test type', array_notation, 'singleton')).toThrow(
              'passed type cannot have both array notation and the $inject property populated');
        });

        return it('looks for $inject in the prototype as well', function() {
            const Cls = (this.test_type = class test_type {
                static initClass() {
                    this.prototype.$inject = ['test_dependency', 'test_dependency_2'];
                }
                constructor(a, b) {}
            });
            Cls.initClass();

            this.test_result.type = this.test_type;
            this.test_result.dependencies = ['test_dependency', 'test_dependency_2'];
            this.test_result.lifetime = 'singleton';

            injector.registerType('test type', this.test_type, 'singleton');
            return expect(injector.types['test type']).toEqual(this.test_result);
        });
    });
}
