import * as provideProviderModule from 'providers/provide-provider';

import testFaker from '../_common/testable-js';
import uuid                              from 'util/uuid';
import {
    buildRuntimeStores, defaultFactory, passiveProviderFactory, providerFactory
} from '../_common/data-structure-factory';
import {provideTransient}                from 'providers';


export default function () {
    beforeAll(function () {
        testFaker.setActiveFakes(['buildGraph']);
    });
    let transientDescriptor, transientSpec, buildGraphStub;

    transientSpec = defaultFactory.createSpec(transientDescriptor);

    beforeEach(function () {
        transientDescriptor = defaultFactory.createDescriptor(function (a, b) {
            this.c = a() + b();
        }, ['a', 'b']);
        testFaker.activateFakes();
        buildGraphStub = testFaker.getFake('buildGraph');
        buildGraphStub.withArgs(transientDescriptor).returns(transientSpec);
    });

    afterEach(function () {
        testFaker.restoreFakes();
        transientDescriptor.provider = undefined;
    });

    describe('type has no dependencies', function () {
        it('should return a function which returns an instance of type', function () {
            let fakeType = testFaker.stub(),
                stubUuid = testFaker.stub(uuid, 'getNext'),
                spec = provideTransient({type: fakeType, name:'fake'})(transientSpec);

            stubUuid.returns(20);
            spec.provider();
            expect(fakeType).toHaveBeenCalledWithNew();
            stubUuid.restore();
        });
    });

    describe('type has dependencies', function () {
        it('should get its spec object with its dependency graph', function () {
            let spec = provideTransient(transientDescriptor)(transientSpec);
            expect(spec.spec).toBe(transientSpec);
            let instance = spec.provider();
            expect(instance.c).toEqual(8);
        });
    });

    describe('type has passive provider', function () {
        it('should call passive provider every time a new instance is requested', function () {
            let stub = testFaker.stub(provideProviderModule, 'default'),
                providerDescriptor = providerFactory.createDescriptor(),
                providerSpec = providerFactory.createSpec(providerDescriptor),
                providerFactoryStub = testFaker.stub();

            providerSpec.provider = testFaker.stub();
            providerFactoryStub.returns({spec: providerSpec, provider: providerSpec.provider});
            stub.withArgs(providerDescriptor).returns(providerFactoryStub);
            transientDescriptor.provider = providerDescriptor;
            let spec = provideTransient(transientDescriptor)(transientSpec);
            spec.provider();
            spec.provider();
            spec.provider();

            expect(providerSpec.provider).toHaveBeenCalledThrice();
            expect(spec.passiveProvider.spec).toBe(providerSpec);
            stub.restore();
        });
        it('should call passive provider every time a new dependency-less instance is requested', function () {
            let stub = testFaker.stub(provideProviderModule, 'default'),
                providerDescriptor = passiveProviderFactory.createDescriptor(),
                providerSpec = passiveProviderFactory.createSpec(providerDescriptor),
                providerFactoryStub = testFaker.stub();

            let spy = testFaker.stub(providerSpec, 'provider');
            providerFactoryStub.returns({spec: providerSpec, provider: providerSpec.provider});
            stub.withArgs(providerDescriptor).returns(providerFactoryStub);
            transientDescriptor.provider = providerDescriptor;
            delete transientDescriptor.dependencies;
            transientDescriptor.type = function () {};
            let spec = provideTransient(transientDescriptor)(transientSpec);
            spec.provider();
            spec.provider();
            spec.provider();

            expect(spy).toHaveBeenCalledThrice();
            expect(spec.passiveProvider.spec).toBe(providerSpec);
            stub.restore();
        });
    });

    describe('::provider', function () {
        it('should return provider instead of instance', function () {
            transientDescriptor.name += '::provider';

            const result = provideTransient(transientDescriptor, buildRuntimeStores())(transientSpec);

            expect(result.provider()()).toBeInstanceOf(transientDescriptor.type);
        });
    });
}
