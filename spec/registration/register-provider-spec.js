import {registerMain, registerProvider} from '../../src/registration';
import testFaker, {harnessedIt}         from '../_common/testable-js';


export default function () {
    const hit = harnessedIt(it);

    beforeAll(function () {
        testFaker.setActiveFakes(['register']);
    });
    let props;
    beforeEach(function () {
        testFaker.activateFakes();
        props = {
            cache: {},
            providers: {}
        };
    });

    afterEach(testFaker.restoreFakes);

    it('should clear cache of any provider with given name', function () {
        props.cache.test = {};
        registerProvider(props, 'test', 'testfn');
        expect(props.cache.test).toBeUndefined();
    });

    hit('should call register with passed name and provider function', function (register) {
        registerProvider(props, 'test', 'testfn');
        expect(register).toHaveBeenCalledWith('test', 'testfn');
    }, ['register']);

    describe('main provider', function () {
        hit('should register the main provider', function (register) {
            registerMain(props, 'testfn');
            expect(register).toHaveBeenCalledWith('main', 'testfn');
        }, ['register']);
    });
}
