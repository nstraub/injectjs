import testFaker from '../_common/testable-js';

import {buildAnonymousDescriptor} from 'injection';


export default function () {
    beforeAll(function () {
        testFaker.setActiveFakes(['getDependencyNames']);
        testFaker.addAction('getDependencyNames', 'returnsListOfDependencies', 'returns', ['test1', 'test2', 'test3']);
    });

    beforeEach(testFaker.activateFakes);
    afterEach(testFaker.restoreFakes);

    it('should call getDependencyNames when passed a function', function () {
        let fn = function () {};
        expect(buildAnonymousDescriptor(fn)).toEqual({type: fn, dependencies: ['test1', 'test2', 'test3']});
    });

    it('get dependencies from contents when passed an array', function () {
        let fn = function () {};
        expect(buildAnonymousDescriptor(['test1', 'test2', 'test3', fn])).toEqual({type: fn, dependencies: ['test1', 'test2', 'test3']});
    });
}
