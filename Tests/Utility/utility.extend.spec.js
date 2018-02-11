import {setup, lifetimes} from '../_setup';
import injector from '../instantiate.injector';

export default function() {
    beforeEach(function() {
        setup.reset_injector();
        return setup.assign_base_types();
    });

    it('extends a registered type with passed function', function() {
        const new_type = function() {};
        injector.extend('base_transient_type', new_type);
        return expect(new_type.prototype).toBeInstanceOf(injector.types.base_transient_type.type);
    });

    it('throws an error when no type is found', () => expect(() => injector.extend('test', function() {})).toThrow('No type "test" found.'));

    return lifetimes.filter((lifetime) => lifetime !== 'transient').map((lifetime) =>
        (() =>
            it(`throws an error when type lifetime is ${lifetime}`, () => expect(() => injector.extend(`base_${lifetime}_type`, function() {})).toThrow('Only transient lifetime types are allowed for now'))
        )());
};

