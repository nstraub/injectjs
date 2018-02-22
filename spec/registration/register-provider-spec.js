import {registerMain, registerProvider} from '../../src/registration';
import testFaker                        from '../_common/testable-js';


export default function () {
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

    it('should call register with passed name and provider function', testFaker.harness(function (register) {
        registerProvider(props, 'test', 'testfn');
        expect(register).toHaveBeenCalledWith('test', 'testfn');
    }, ['register']));

    describe('main provider', function () {
        it('should register the main provider', testFaker.harness(function (register) {
            registerMain(props, 'testfn');
            expect(register).toHaveBeenCalledWith('main', 'testfn');
        }, ['register']));
    });
}
