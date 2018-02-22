import provideCached from 'providers/provide-cached';

import testFaker from '../_common/testable-js';



export default function () {

    beforeAll(function () {
        testFaker.setActiveFakes(['provideTransient']);
    });
    beforeEach(testFaker.activateFakes);
    afterEach(testFaker.restoreFakes);

    it('should return new spec when no spec is cached', function () {
        let spec = {
            provider: function () {
                return 'test';
            }
        };
        let factoryStub = testFaker.stub();
        factoryStub.returns(spec);

        testFaker.getFake('provideTransient').returns(factoryStub);
        let cached = provideCached({}, {});

        expect(cached).toBe(spec);
    });

    it('should return cached spec after second call', function () {
        let spec = {
            provider: function () {
                return 'test';
            }
        };
        let factoryStub = testFaker.stub();
        factoryStub.returns(spec);

        let stub = testFaker.getFake('provideTransient');
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
                provider: testFaker.stub().callsFake((a)=>spec.passiveProviderSpec.dependencies[0].provider(a)),
                dependencies: [{provider: function (adhocs) {return adhocs.instance;}}]
            }
        };
        let factoryStub = testFaker.stub();
        factoryStub.returns(spec);

        let stub = testFaker.getFake('provideTransient');
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
