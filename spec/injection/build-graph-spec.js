import {buildGraph} from '../../src/injection';
import {
    buildRuntimeStores,
    constantValueFactory, defaultFactory
} from '../_common/data-structure-factory';

import testFaker, {harnessedIt} from '../_common/testable-js';


export default function () {
    let fn = function (a, b) {
        this.c = a.id + b.id;
    };

    const hit = harnessedIt(it);

    beforeEach(function () {
        testFaker.setActiveFakes(['getUuid', 'assertCircularReferences', 'getDescriptor', 'buildProvider']);
        testFaker.addAction('getUuid', 'callThrough', 'callThrough');
        testFaker.addAction('getDescriptor', 'createConstantDescriptor', 'callsFake', constantValueFactory.createDescriptor);
    });
    beforeEach(testFaker.activateFakes);
    afterEach(testFaker.restoreFakes);
    afterEach(testFaker.clearActions);


    hit('should build the appropriate specs for each dependency passed in descriptor', function (buildProvider) {
        buildProvider.callsFake(()=> constantValueFactory.createSpec);

        let descriptor = defaultFactory.createDescriptor(fn, ['a', 'b']);
        let result = buildGraph(descriptor, buildRuntimeStores());
        expect(result.descriptor.type).toBe(fn);
        expect(result.dependencies.length).toBe(2);
        expect(result.dependencies[0]).toEqual(constantValueFactory.createSpec());
        expect(result.dependencies[1]).toEqual(constantValueFactory.createSpec());
    }, 'buildProvider');

    hit('should set the parent and root on each spec it builds', function (buildProvider) {
        buildProvider.callsFake((a, b) => (spec)=>spec);

        let descriptor = defaultFactory.createDescriptor(fn, ['a', 'b']);
        let result = buildGraph(descriptor, buildRuntimeStores());
        expect(result.parent).toBeUndefined();
        expect(result.root).toBe(result);

        expect(result.dependencies[0].parent).toBe(result);
        expect(result.dependencies[0].root).toBe(result);

        expect(result.dependencies[1].parent).toBe(result);
        expect(result.dependencies[1].root).toBe(result);
    }, 'buildProvider');

    hit('should assert circular references', function (buildProviderModule, assertCircular, getDescriptor) {
        let createDefaultDescriptor = (a, b) => defaultFactory.createDescriptor(b, ['a', 'b']);
        getDescriptor.onFirstCall().callsFake(createDefaultDescriptor);
        getDescriptor.onSecondCall().callsFake(createDefaultDescriptor);


        buildProviderModule.callsFake((a, b, c, d) => (spec)=>spec);

        let descriptor = defaultFactory.createDescriptor(fn, ['a', 'b']);
        buildGraph(descriptor, buildRuntimeStores());
        expect(assertCircular).toHaveBeenCalledTwice();
    }, 'buildProvider', 'assertCircularReferences', 'getDescriptor');
};
