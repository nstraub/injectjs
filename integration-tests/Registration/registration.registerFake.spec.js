import {setup}  from '../_setup';
import injector from '../instantiate.injector';


export default function () {
    beforeEach(() => setup.reset_injector());
    it('registers a provided fake', function () {
        injector.registerFake('test type', this.test_type, 'singleton');
        this.test_result.lifetime = 'singleton';
        return expect(injector.fakes['test type']).toEqual(this.test_result);
    });

    it('defaults to transient lifetime', function () {
        injector.registerFake('test type', ['test_dependency', this.test_type]);
        this.test_result.dependencies = ['test_dependency'];
        return expect(injector.fakes['test type']).toEqual(this.test_result);
    });

    it('throws an error when invalid lifetime is passed', function () {
            expect(() => injector.registerFake('test type', this.test_type, 'invalid lifetime'))
                .toThrow('invalid lifetime "invalid lifetime" provided. Valid lifetimes are singleton, transient, instance and parent');
    });

    return it('registers passive providers', function () {
        injector.registerFake('test type', ['test_dependency', this.test_type], null, 'passive_provider');
        this.test_result.dependencies = ['test_dependency'];
        this.test_result.provider = 'passive_provider';
        return expect(injector.fakes['test type']).toEqual(this.test_result);
    });
};
