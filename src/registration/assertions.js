import assert from 'assert-js';

export function assertDestinationIsCorrect(where) {
    assert.oneOf(where, ['types', 'providers', 'fakes'], `invalid destination "${where}" provided. Valid destinations are types, providers and fakes`);
}

export function assertNameRequired(name) {
    assert.string(name, 'Type must have a name');
    assert.notEmpty(name, 'Type must have a name');
}

export function assertTypeRequired(type) {
    assert.true(!!type, 'no type was passed');
}

export function assertTypeDependencyIntegrity(type, realType) {
    assert.false(!!(type.$inject || realType.$inject), 'passed type cannot have both array notation and the $inject property populated');
}

export function assertRealTypeWasPassed(realType) {
    assert.isFunction(realType, 'no type was passed');
}
