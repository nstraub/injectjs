import provideParent            from '../../src/providers/provide-parent';
import testFaker from '../_common/testable-js';


export default function () {
    testFaker.setActiveFakes(['provideCached']);
    let pcStub;

    beforeEach(function () {
        testFaker.activateFakes();
        pcStub = testFaker.getFake('provideCached');
        pcStub.returns({provider: testFaker.stub()});
    });

    afterEach(function () {
        pcStub.restore();
    });

    it('should return cache provider for topmost_parent.children', function () {
        provideParent({name: 'test'},{})({parent:{children:{test: {}}}}).provider();
        expect(pcStub).toHaveBeenCalledOnce();
    });
    it('should find parent if no parent with coinciding children exist', function () {
        let parent = {descriptor: {dependencies: []}, parent: {descriptor:{dependencies:['test']}}};
        provideParent({name: 'test'},{})({parent}).provider();
        expect(parent.parent.children).not.toBeUndefined();
    });
    it('should use an empty object if no parent provided', function () {
        let stores = {};
        provideParent({})(stores).provider();

        expect(stores.children).toBeUndefined();
    });
}
