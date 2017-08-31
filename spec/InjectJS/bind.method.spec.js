import {stores, ProviderBuilder, InjectJS} from '../util/setup.teardown';

export default function () {


    it('should register a new provider proxy in the providers store', function () {
        InjectJS.bind('test');

        expect(stores.providers.test).toBeInstanceOf(ProviderBuilder);
    });
    it('should return registered provider proxy', function () {
        const provider = InjectJS.bind('test');

        expect(stores.providers.test).toBe(provider);
    });
    it('should throw an error if no dependency name is passed', function () {
        expect(function () { InjectJS.bind(); }).toThrowError('you must supply a name for your dependency');
    });
    it('should replace an existing dependency provider with a new one if the same name is passed', function () {
        const provider = InjectJS.bind('test');

        expect(InjectJS.bind('test')).not.toBe(provider);
    });
}
