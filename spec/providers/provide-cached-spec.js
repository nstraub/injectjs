import provideCached from 'providers/provide-cached';
import autoStub      from '../_common/auto-stub';


let stubber = autoStub();

stubber.addStubDirective('provideTransientModule');

export default function () {
    beforeEach(stubber.stub);
    afterEach(stubber.unstub);

    it('should return new spec when no spec is cached', function () {
        let spec = {
            provider: function () {
                return 'test';
            }
        };

        stubber.get('provideTransientModule::default').returns(spec);
        let cached = provideCached({}, {});

        expect(cached).toBe(spec);
    });

    it('should return cached spec after second call', function () {
        let spec = {
            provider: function () {
                return 'test';
            }
        };

        let stub = stubber.get('provideTransientModule::default');
        stub.returns(spec);

        let cache = {};

        expect(provideCached({}, cache)).toBe(spec);
        expect(provideCached({}, cache)).toBe(spec);
        expect(provideCached({}, cache).provider()).toBe('test');

        expect(stub).toHaveBeenCalledOnce();
    });
}
