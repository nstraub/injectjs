import registerType from 'registration/register-type';
import registerFake from 'registration/register-fake';
import testFaker from '../_common/testable-js';


export default function () {
    let typeFn = function () {
        },
        props;

    beforeAll(function () {
        testFaker.setActiveFakes(['registerInstantiable']);
    });

    beforeEach(function () {
        testFaker.activateFakes();
        props = {
            DEFAULT_LIFETIME: 'transient',
            cache: {},
            fakes: {},
            types: {}
        };
    });

    afterEach(testFaker.restoreFakes);

    it('should throw an exception when asked to create a singleton type which is already instantiated', function () {
        props.cache.test = {};
        expect(() => registerType(props, 'test', typeFn, 'singleton'))
            .toThrow('you cannot re-register a singleton that has already been instantiated');
    });

    it('should delete cached template if registering an existing type which does not have a singleton lifetime', function () {
        props.cache.test = {};
        registerType(props, 'test', typeFn, 'transient');
        expect(props.cache.test).toBeUndefined();
    });

    it('should default to lifetime passed in props when no lifetime is passed', function () {
        registerType(props, 'test', typeFn);

        expect(testFaker.getFake('registerInstantiable')).toHaveBeenCalledWith(props.types, 'test', typeFn, 'transient');
    });

    describe('register fake', function () {
        it('should delete cached template if registering an existing type', function () {
            props.cache.test = {};
            registerFake(props, 'test', typeFn, 'singleton');
            expect(props.cache.test).toBeUndefined();
        });

        it('should default to lifetime passed in props when no lifetime is passed', function () {
            registerFake(props, 'test', typeFn);

            expect(testFaker.getFake('registerInstantiable')).toHaveBeenCalledWith(props.fakes, 'test', typeFn, 'transient');
        });
    })
}
