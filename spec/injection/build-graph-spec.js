import {buildGraph} from '../../src/injection';
import {
    buildRuntimeStores,
    constantValueFactory, defaultFactory
} from '../_common/data-structure-factory';

import td from 'testdouble';

uuidStub = td.replace('../../src/util/uuid').default;

const stubber = autoStub();
stubber.addStubDirective('uuid', 'getNext');
stubber.addStubDirective('assertCircularReferencesModule');
stubber.addStubDirective('getDescriptorModule');
stubber.addStubDirective('buildProviderModule');

export default function () {
    let fn = function (a, b) {
        this.c = a.id + b.id;
    };
    beforeEach(stubber.stub);
    afterEach(stubber.unstub);
    beforeEach(function () {
        stubber.get('uuid::getNext').callThrough();
        stubber.get('getDescriptorModule::default').callsFake(constantValueFactory.createDescriptor);
    });

    it('should build the appropriate specs for each dependency passed in descriptor', function () {
        stubber.get('buildProviderModule::default').callsFake(()=> constantValueFactory.createSpec);
        let descriptor = defaultFactory.createDescriptor(fn, ['a', 'b']);
        let result = buildGraph(descriptor, buildRuntimeStores());
        expect(result.descriptor.type).toBe(fn);
        expect(result.dependencies.length).toBe(2);
        expect(result.dependencies[0]).toEqual(constantValueFactory.createSpec());
        expect(result.dependencies[1]).toEqual(constantValueFactory.createSpec());
    });
    it('should set the parent and root on each spec it builds', function () {
        stubber.get('buildProviderModule::default').callsFake((a, b) => (spec)=>spec);

        let descriptor = defaultFactory.createDescriptor(fn, ['a', 'b']);
        let result = buildGraph(descriptor, buildRuntimeStores());
        expect(result.parent).toBeUndefined();
        expect(result.root).toBe(result);

        expect(result.dependencies[0].parent).toBe(result);
        expect(result.dependencies[0].root).toBe(result);

        expect(result.dependencies[1].parent).toBe(result);
        expect(result.dependencies[1].root).toBe(result);
    });
    it('should assert circular references', function () {
        stubber.get('getDescriptorModule::default').onFirstCall().callsFake((a, b) => defaultFactory.createDescriptor(b, ['a','b']));
        stubber.get('getDescriptorModule::default').onSecondCall().callsFake((a, b) => defaultFactory.createDescriptor(b, ['a','b']));

        let buildProviderModule = stubber.get('buildProviderModule::default');

        buildProviderModule.callsFake((a, b, c, d) => ()=>buildGraph(b, a, c, d));
        let assertCircular = stubber.get('assertCircularReferencesModule::default');

        let descriptor = defaultFactory.createDescriptor(fn, ['a', 'b']);
        buildGraph(descriptor, buildRuntimeStores());
        expect(assertCircular).toHaveBeenCalledTwice();
    });
};
