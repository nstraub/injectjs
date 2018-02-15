import sinon                         from 'sinon';

import register                      from 'registration/register';
import * as assertionsModule         from 'registration/assertions';
import * as getDependencyNamesModule from 'util/get-dependency-names';
import uuid                          from 'util/uuid';


export default function () {
    let typeFn = function () {
        },
        stubs = [],
        newDescriptor = {
            name: 'test',
            type: typeFn,
            dependencies: undefined,
            lifetime: 'transient',
            hashCode: 2
        };

    beforeEach(function () {
        Object.keys(assertionsModule).forEach(function (key) {
            stubs.push(sinon.stub(assertionsModule, key));
        });
        stubs.push(sinon.stub(getDependencyNamesModule, 'default'));
        stubs.push(sinon.stub(uuid, 'getNext').returns(2));
    });

    afterEach(function () {
        stubs.forEach(function (stub) {
            stub.restore();
        });

        newDescriptor.dependencies = undefined;
        newDescriptor.type = typeFn;
    });

    it('should return correct descriptor when type is function', function () {
        expect(register('test', typeFn, 'transient')).toEqual(newDescriptor);
    });
    it('should return correct descriptor when type is function with $inject', function () {
        let $injectTypeFn = function () {
        };
        $injectTypeFn.$inject = ['a', 'b'];
        newDescriptor.type = $injectTypeFn;
        newDescriptor.dependencies = $injectTypeFn.$inject;

        expect(register('test', $injectTypeFn, 'transient'))
            .toEqual(newDescriptor);
    });
    it('should return correct descriptor when type is function with $inject on prototype', function () {
        let $injectTypeFn = function () {
        };
        $injectTypeFn.prototype.$inject = ['a', 'b'];

        newDescriptor.type = $injectTypeFn;
        newDescriptor.dependencies = $injectTypeFn.prototype.$inject;
        expect(register('test', $injectTypeFn, 'transient'))
            .toEqual(newDescriptor);
    });
    it('should return correct descriptor when type is array', function () {
        newDescriptor.dependencies = ['a', 'b'];

        expect(register('test', ['a', 'b', typeFn], 'transient'))
            .toEqual(newDescriptor);
    });
    it('should return correct descriptor when type is array of length 1', function () {
        expect(register('test', [typeFn], 'transient')).toEqual(newDescriptor);
    });
    it('should throw an exception if passed type is neither array nor function', function () {
        expect(() => register('test', undefined, 'transient'))
            .toThrow('type must be a function or an array');
    });
}
