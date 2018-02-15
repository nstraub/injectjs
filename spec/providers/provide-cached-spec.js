import provideCached from 'providers/provide-cached';
import sinon    from 'sinon';
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
        let factoryStub = sinon.stub();
        factoryStub.returns(spec);

        stubber.get('provideTransientModule::default').returns(factoryStub);
        let cached = provideCached({}, {});

        expect(cached).toBe(spec);
    });

    it('should return cached spec after second call', function () {
        let spec = {
            provider: function () {
                return 'test';
            }
        };
        let factoryStub = sinon.stub();
        factoryStub.returns(spec);

        let stub = stubber.get('provideTransientModule::default');
        stub.returns(factoryStub);

        let cache = {};

        expect(provideCached({}, cache)).toBe(spec);
        expect(provideCached({}, cache)).toBe(spec);
        expect(provideCached({}, cache).provider()).toBe('test');
        expect(provideCached({}, cache).provider()).toBe('test');

        expect(stub).toHaveBeenCalledOnce();
    });

    it('should call passive provider if present on every request', function () {
        let spec = {
            provider: function () {
                return spec.passiveProviderSpec.provider({instance: 'test'});
            },
            passiveProviderSpec: {
                provider: sinon.stub().callsFake((a)=>spec.passiveProviderSpec.dependencies[0].provider(a)),
                dependencies: [{provider: function (adhocs) {return adhocs.instance;}}]
            }
        };
        let factoryStub = sinon.stub();
        factoryStub.returns(spec);

        let stub = stubber.get('provideTransientModule::default');
        stub.returns(factoryStub);

        let cache = {};

        expect(provideCached({}, cache)).toBe(spec);
        expect(provideCached({}, cache).provider()).toBe('test');
        expect(provideCached({}, cache).provider()).toBe('test');
        expect(provideCached({}, cache).provider()).toBe('test');

        expect(stub).toHaveBeenCalledOnce();
        expect(spec.passiveProviderSpec.provider).toHaveBeenCalledThrice();
    });
}
