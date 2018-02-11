import injector from '../instantiate.injector';
import {setup, lifetimes, get_adhoc_dependency_tests} from '../_setup';


export default function() {
    beforeAll(function() {
        setup.make_descriptor({
            name: 'test_type'});
        setup.make_descriptor({
            target: 'providers',
            name: 'test_provider'
        });
        return setup.make_descriptor({
            name: 'singleton_test_type',
            lifetime: 'singleton'
        });
    });

    it('clears cached dependency for type name', function() {
        injector.inject('test_type');

        injector.registerType('test_type', function() {});

        return expect(injector.cache.test_type).toBeUndefined();
    });

    it('clears cached dependency for provider name', function() {
        injector.inject('test_provider');

        injector.registerProvider('test_provider', function() {});

        return expect(injector.cache.test_type).toBeUndefined();
    });

    return it('throws an error when trying to register a singleton type that`s already registered and instantiated', function() {
        injector.get('singleton_test_type');

        return expect(() => injector.registerType('singleton_test_type', (function() {  }), 'singleton')).toThrow(
            'you cannot re-register a singleton that has already been instantiated'
        );
    });
};
