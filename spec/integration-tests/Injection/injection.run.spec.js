import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';
import sinon from 'sinon';

let injector;
export default function() {
    beforeEach(() => injector = setup.reset_injector());
    it('runs the main function', function() {
        const test_main = sinon.spy();

        injector.registerMain(test_main);

        injector.run();

        return expect(test_main).toHaveBeenCalledOnce();
    });

    return it('throws a custom error when main provider doesn`t exist', () => expect(() => injector.run()).toThrow('No main method registered. Please register one by running injector.registerMain() before running the app'));
};
