import * as provideCachedModule from '../../src/providers/provide-cached';
import provideRoot from '../../src/providers/provide-root';
import sinon from 'sinon';


export default function () {
    let pcStub;

    beforeEach(function () {
        pcStub = sinon.stub(provideCachedModule, 'default');
        pcStub.returns({provider: sinon.stub()});
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
