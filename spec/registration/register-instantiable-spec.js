import testFaker from '../_common/testable-js';

import * as registerModule       from 'registration/register';
import * as assertLifetimeModule from 'registration/assert-lifetime';

import registerInstantiable     from 'registration/register-instantiable';
import {passiveProviderFactory} from '../_common/data-structure-factory';


export default function () {
    let typeFn = function () {
        },
        assertLifetimeStub,
        props, registerStub,
        newDescriptor = {
            name: 'test',
            type: typeFn,
            dependencies: [],
            lifetime: 'transient',
            hashCode: 2
        },
        providerFn = function () {};

    let passiveProviderDescriptor;
    beforeEach(function () {
        props = {
            DEFAULT_LIFETIME: 'transient',
            cache: {},
            fakes: {},
            types: {}
        };
        registerStub = testFaker.stub(registerModule, 'default');
        registerStub.withArgs('test', typeFn, 'transient')
            .returns(newDescriptor);

        passiveProviderDescriptor =
            passiveProviderFactory.createDescriptor('test', providerFn);
        registerStub.withArgs('test::passive', providerFn).returns(passiveProviderDescriptor);

        assertLifetimeStub = testFaker.stub(assertLifetimeModule, 'default');
    });

    afterEach(function () {
        registerStub.restore();
        assertLifetimeStub.restore();
    });

    it('should populate props.fakes with a new descriptor for the passed type', function () {
        registerInstantiable(props.fakes, 'test', typeFn, 'transient');

        expect(props.fakes.test).toBe(newDescriptor);
    });

    it('should assign to the descriptor`s provider when passed one', function () {
        registerInstantiable(props.types, 'test', typeFn, 'transient', providerFn);

        expect(props.types.test).toBe(newDescriptor);
        expect(props.types.test.provider).toBe(passiveProviderDescriptor);
    });
}
