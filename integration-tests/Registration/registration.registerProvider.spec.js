import {setup} from '../_setup';
import injector from '../instantiate.injector';


export default function() {
    beforeEach(function() {
        return this.test_result.lifetime = undefined;
    });

    return it('registers a provider', function() {
        injector.registerProvider('test type', this.test_type);
        return expect(injector.providers['test type']).toEqual(this.test_result);
    });
};
