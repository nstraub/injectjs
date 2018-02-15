import * as provideCachedModule from '../../src/providers/provide-cached';
import provideParent            from '../../src/providers/provide-parent';
import sinon                    from 'sinon';


export default function () {
    let pcStub;

    beforeEach(function () {
        pcStub = sinon.stub(provideCachedModule, 'default');
        pcStub.returns({provider: sinon.stub()});
    });

    afterEach(function () {
        pcStub.restore();
    });

    it('should return cache provider for topmost_parent.children', function () {
        provideParent({name: 'test'},{},{children:{test: {}}},{}).provider();
        expect(pcStub).toHaveBeenCalledOnce();
    });
    it('should find parent if no parent with coinciding children exist', function () {
        let parent = {descriptor: {dependencies: []}, parent: {descriptor:{dependencies:['test']}}};
        provideParent({name: 'test'},{},parent,{}).provider();
        expect(parent.parent.children).not.toBeUndefined();
    });
    it('should use an empty object if no parent provided', function () {
        let stores = {};
        provideParent({},stores).provider();

        expect(stores.children).toBeUndefined();
    });
}
