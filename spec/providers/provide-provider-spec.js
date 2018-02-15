import provideProvider from 'providers/provide-provider';
import sinon from 'sinon';
import autoStub from '../_common/auto-stub';

let stubber = autoStub();

stubber.addStubDirective('buildGraphModule');
export default function () {
    beforeEach(stubber.stub);
    afterEach(stubber.unstub);

    it('should return a spec which runs the provided function when called', function () {
        let fn = sinon.spy();
        stubber.get('buildGraphModule::default').returns({descriptor: {type: fn}});

        let spec = provideProvider({type: fn}, {}, {}, {});

        spec.provider();
        expect(fn).toHaveBeenCalledOnce();
    });

    it('should return a spec which runs the provided function passing its dependencies when called', function () {
        let fn = sinon.spy();
        let fn2 = sinon.spy();
        stubber.get('buildGraphModule::default').returns({descriptor: {type: fn}, dependencies: [{provider: fn2}]});

        let spec = provideProvider({type: fn});

        spec.provider();
        expect(fn).toHaveBeenCalledOnce();
        expect(fn2).toHaveBeenCalledOnce();
    });
}
