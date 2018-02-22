import provideRoot from '../../src/providers/provide-root';
import testFaker from '../_common/testable-js';


export default function () {
    beforeAll(function () {
        testFaker.setActiveFakes(['provideCached']);
    });
    let pcStub;

    beforeEach(function () {
        testFaker.activateFakes();
        pcStub = testFaker.getFake('provideCached');
        pcStub.returns({provider: testFaker.stub()});
    });

    afterEach(function () {
        pcStub.restore();
    });

    it('should return cache provider for root.roots', function () {
        provideRoot({},{},{})({root: {roots:{}}}).provider();
        expect(pcStub).toHaveBeenCalledOnce();
    });
    it('should create root.roots if it does not exist', function () {
        let root = {};
        provideRoot({},{},{})({root}).provider();
        expect(root.roots).not.toBeUndefined();
    });
    it('should use an empty object if no root provided', function () {
        let stores = {};
        provideRoot({})(stores).provider();

        expect(stores.roots).toBeUndefined();
    });
}
