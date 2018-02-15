import sinon                    from 'sinon';
import * as provideCachedModule from '../../src/providers/provide-cached';


export default function (stub) {
    beforeEach(function () {
        stub = sinon.stub(provideCachedModule, 'default');
        stub.returns({provider: sinon.stub()});
    });

    afterEach(function () {
        stub.restore();
    });
}
