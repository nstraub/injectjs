import sinon from 'sinon';

import * as buildGraphModule      from 'injection/build-graph';
import * as provideProviderModule from 'providers/provide-provider';

import uuid                              from 'util/uuid';
import {
    buildRuntimeStores, defaultFactory, providerFactory
} from '../_common/data-structure-factory';
import {provideTransient}                from 'providers';


export default function () {
    let transientDescriptor = defaultFactory.createDescriptor(function (a, b) {
            this.c = a() + b();
        }, ['a', 'b']),
        transientSpec = defaultFactory.createSpec(transientDescriptor),
        buildGraphStub;

    beforeEach(function () {
        buildGraphStub = sinon.stub(buildGraphModule, 'default');
        buildGraphStub.withArgs(transientDescriptor).returns(transientSpec);
    });

    afterEach(function () {
        buildGraphStub.restore();
        transientDescriptor.provider = undefined;
    });

    describe('type has no dependencies', function () {
        it('should return a function which returns an instance of type', function () {
            let fakeType = sinon.spy(),
                stubUuid = sinon.stub(uuid, 'getNext'),
                spec = provideTransient({type: fakeType, name:'fake'});

            stubUuid.returns(20);
            spec.provider();
            expect(fakeType).toHaveBeenCalledWithNew();
            stubUuid.restore();
        });
    });

    describe('type has dependencies', function () {
        it('should get its spec object with its dependency graph', function () {
            let spec = provideTransient(transientDescriptor);
            expect(spec).toBe(transientSpec);
            let instance = spec.provider();
            expect(instance.c).toEqual(8);
        });
    });

    describe('type has passive provider', function () {
        it('should return the passive providers spec with itself as the first dependency spec', function () {
            let stub = sinon.stub(provideProviderModule, 'default'),
                providerDescriptor = providerFactory.createDescriptor(),
                providerSpec = providerFactory.createSpec(providerDescriptor);

            stub.withArgs(providerDescriptor).returns(providerSpec);
            transientDescriptor.provider = providerDescriptor;
            let spec = provideTransient(transientDescriptor);
            expect(spec).toBe(providerSpec);
            expect(spec.dependencies.length).toEqual(3);
            expect(spec.dependencies[0]).toBe(transientSpec);
            stub.restore();
        });
    });

    describe('::provider', function () {
        it('should return provider instead of instance', function () {
            transientDescriptor.name += '::provider';

            const result = provideTransient(transientDescriptor, buildRuntimeStores());

            expect(result.provider()()).toBeInstanceOf(transientDescriptor.type);
        });
    });
}
