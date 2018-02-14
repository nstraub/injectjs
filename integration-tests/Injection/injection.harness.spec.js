import injector from '../instantiate.injector';
import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';
import sinon from 'sinon';
export default function() {
    beforeEach(() => sinon.spy(injector, 'inject'));

    afterEach(() => injector.inject.restore());

    return it('delays injection until passed function is instantiated', function() {
        const test_method = () => 'test';

        const harness = injector.harness(test_method);

        expect(injector.inject).not.toHaveBeenCalled();

        const result = harness();

        expect(injector.inject).toHaveBeenCalledWith(test_method);
        return expect(result).toBe('test');
    });
};
