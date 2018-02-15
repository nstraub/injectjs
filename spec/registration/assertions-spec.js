import {
    assertDestination, assertNameRequired, assertTypeProvided,
    assertTypeDependency, assertTypeRequired
}                                 from 'registration/assertions';
import {map}              from 'ramda';
import {notToThrow, toThrowError} from '../_common/functional-expectations';


const assertions = {
    typeRequired: {
        assertionFn: assertTypeRequired,
        titlePrefix: 'if passed a ',
        titleSuffix: ' statement',
        throwTitle: 'falsy',
        passTitle: 'truthy',
        errorMessage: 'no type was passed'
    },
    typeProvided: {
        assertionFn: assertTypeProvided,
        titlePrefix: 'if ',
        throwTitle: 'not ',
        passTitle: '',
        titleSuffix: 'passed a function',
        errorMessage: 'no type was passed'
    },
    destination: {
        assertionFn: assertDestination,
        titlePrefix: 'if passed ',
        throwTitle: 'an invalid ',
        passTitle: 'a valid ',
        titleSuffix: 'key',
        errorMessage: 'invalid destination "invalid" provided. Valid destinations are types, providers and fakes'
    },
    nameRequired: {
        assertionFn: assertNameRequired,
        titlePrefix: 'if ',
        throwTitle: 'not passed a valid string or passed an empty string',
        passTitle: 'passed a valid string',
        titleSuffix: '',
        errorMessage: 'Type must have a name'
    },
    typeDependency: {
        assertionFn: assertTypeDependency,
        titlePrefix: 'if ',
        throwTitle: 'either',
        passTitle: 'neither',
        titleSuffix: ' type has an $inject property',
        errorMessage: 'passed type cannot have both array notation and the $inject property populated'
    }
};

const assertSpec = function (assertion, throwArgs, noThrowArgs) {
    let {assertionFn, titlePrefix, titleSuffix, throwTitle, passTitle, errorMessage} = assertions[assertion];
    let expectm = map(function (arg) {
        if (arg && arg.length === 2) {
            return expect(() => assertionFn(...arg));
        }
        return expect(() => assertionFn(arg));
    });
    return function () {
        it(`should not throw exceptions ${titlePrefix}${passTitle}${titleSuffix}`, function () {
            expectm(noThrowArgs).forEach(notToThrow);
        });
        it(`should throw an exception ${titlePrefix}${throwTitle}${titleSuffix}`, function () {
            expectm(throwArgs).forEach(toThrowError(errorMessage));
        });
    };
};

export default function () {
    describe('Assert Destination', assertSpec('destination', ['invalid'], ['types', 'providers', 'fakes']));

    describe('Assert Name Required', assertSpec('nameRequired', [undefined, {}, [], ''], ['valid name']));

    describe('Assert Type Required', assertSpec('typeRequired', [undefined, '', 0], [{}]));

    describe('Assert Type Provided', assertSpec('typeProvided', [[], '', {}], [() => {}]));
    const i = {$inject: 'test'};
    const e = {};
    describe('Assert Type Dependency', assertSpec('typeDependency', [[i, i], [e, i], [i, e]], [[e, e]]));
}
