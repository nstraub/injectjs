import provideProvider from 'providers/provide-provider';
import testFaker from '../_common/testable-js';


export default function () {

    beforeAll(function () {
        testFaker.setActiveFakes(['buildGraph']);
    });
    beforeEach(testFaker.activateFakes);
    afterEach(testFaker.restoreFakes);

    it('should return a spec which runs the provided function when called', function () {
        let fn = testFaker.stub();
        testFaker.getFake('buildGraph').returns({descriptor: {type: fn}});

        let spec = provideProvider({type: fn}, {}, {}, {})({descriptor: {type: fn}});

        spec.provider();
        expect(fn).toHaveBeenCalledOnce();
    });

    it('should return a spec which runs the provided function passing its dependencies when called', function () {
        let fn = testFaker.stub();
        let fn2 = testFaker.stub();
        testFaker.getFake('buildGraph').returns({descriptor: {type: fn}, dependencies: [{provider: fn2}]});

        let spec = provideProvider({type: fn})({descriptor: {type: fn}, dependencies: [{provider: fn2}]});

        spec.provider();
        expect(fn).toHaveBeenCalledOnce();
        expect(fn2).toHaveBeenCalledOnce();
    });
}
