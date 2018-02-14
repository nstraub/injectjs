import {
    assertDestination, assertNameRequired, assertTypeProvided,
    assertTypeDependency, assertTypeRequired
} from 'registration/assertions';


export default function () {
    describe('Assert Destination', function () {
        it('should not throw exceptions if passed a valid key', function () {
            expect(() => assertDestination('types')).not.toThrow();
            expect(() => assertDestination('providers')).not.toThrow();
            expect(() => assertDestination('fakes')).not.toThrow();
        });
        it('should throw an exception if passed an invalid key', function () {
            expect(() => assertDestination('invalid'))
                .toThrowError('invalid destination "invalid" provided. Valid destinations are types, providers and fakes');
        });
    });

    describe('Assert Name Required', function () {
        it('should not throw exceptions if passed a valid name', function () {
            expect(() => assertNameRequired('valid name')).not.toThrow();
        });
        it('should throw an exception if not passed a string', function () {
            expect(() => assertNameRequired())
                .toThrowError('Type must have a name');
            expect(() => assertNameRequired({}))
                .toThrowError('Type must have a name');
            expect(() => assertNameRequired([]))
                .toThrowError('Type must have a name');
        });
        it('should throw an exception if passed an empty string', function () {
            expect(() => assertNameRequired(''))
                .toThrowError('Type must have a name');
        });
    });

    describe('Assert Type Required', function () {
        it('should not throw exceptions if passed a truthy statement', function () {
            expect(() => assertTypeRequired({})).not.toThrow();
        });
        it('should throw an exception if passed a falsy statement', function () {
            expect(() => assertTypeRequired())
                .toThrowError('no type was passed');
            expect(() => assertTypeRequired(''))
                .toThrowError('no type was passed');
            expect(() => assertTypeRequired(0))
                .toThrowError('no type was passed');
        });
    });

    describe('Assert Type Provided', function () {
        it('should not throw exceptions if passed a function', function () {
            expect(() => assertTypeProvided(() => {
            })).not.toThrow();
        });
        it('should throw an exception if not passed a function', function () {
            expect(() => assertTypeProvided([]))
                .toThrowError('no type was passed');
            expect(() => assertTypeProvided(''))
                .toThrowError('no type was passed');
            expect(() => assertTypeProvided({}))
                .toThrowError('no type was passed');
        });
    });

    describe('Assert Type Dependency', function () {
        it('should not throw exceptions if neither type has an $inject property', function () {
            expect(() => assertTypeDependency({}, {})).not.toThrow();
        });
        it('should throw an exception if either type has an $inject property', function () {
            let errorMessage = 'passed type cannot have both array notation and the $inject property populated';
            expect(() => assertTypeDependency({$inject: 'test'}, {$inject: 'test'}))
                .toThrowError(errorMessage);
            expect(() => assertTypeDependency({$inject: 'test'}, {}))
                .toThrowError(errorMessage);
            expect(() => assertTypeDependency({}, {$inject: 'test'}))
                .toThrowError(errorMessage);
        });
    });
}
