import {setup} from '../_setup';
import injector from '../instantiate.injector';


export default function() {
    beforeEach(() => setup.reset_injector());
    return it('registers the main entry point', function() {
        injector.registerMain(this.test_type);
        this.test_result.name = 'main';
        this.test_result.lifetime = undefined;
        return expect(injector.providers['main']).toEqual(this.test_result);
    });
};
