import {setup} from '../_setup';
import injector from '../instantiate.injector';


export default function() {
    beforeEach(() => setup.reset_injector());
    it('registers a provided type', function() {
        injector.registerType('test type', this.test_type, 'singleton');
        this.test_result.lifetime = 'singleton';
        return expect(injector.types['test type']).toEqual(this.test_result);
    });

    it('defaults to transient lifetime', function() {
        injector.registerType('test type', ['test_dependency', this.test_type]);
        this.test_result.dependencies = ['test_dependency'];
        return expect(injector.types['test type']).toEqual(this.test_result);
    });

    it('registers a provider for the type when specified', function() {
        const type = function() {};
        injector.registerType('test type', type, null, 'test_provider');
        this.test_result.type = type;
        this.test_result.lifetime = 'transient';
        this.test_result.provider = 'test_provider';

        return expect(injector.types['test type']).toEqual(this.test_result);
    });

    return it('throws an error when invalid lifetime is passed',  function () {
            return expect(() =>{
                return injector.registerType('test type', this.test_type,
                    'invalid lifetime');
            }).toThrow('invalid lifetime "invalid lifetime" provided. Valid lifetimes are singleton, transient, instance and parent');
        }
    );
};
