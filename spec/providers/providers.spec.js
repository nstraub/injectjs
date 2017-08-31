/*global describe*/
/*global it*/
/*global expect*/
import {createProviderProxyPrototype} from '../../src/providers/provider.proxy';
import proxy_provider_spec from './proxy.provider.spec';
import provider_builder_spec from './provider.builder.spec';
import base_provider_spec from './base.provider.spec';
import transient_provider_spec from './transient.provider.spec';
import singleton_provider_spec from './singleton.provider.spec';
import state_provider_spec from './state.provider.spec';
import root_provider_spec from './root.provider.spec';
import parent_provider_spec from './parent.provider.spec';

export default function () {
    describe('provider proxy prototype factory', function () {
        it('should throw an error when no stores object is passed', function () {
            expect(function () {
                createProviderProxyPrototype();
            }).toThrowError('no stores object passed.');
        });
        it('should throw an error when no providers object is passed', function () {
            expect(function () {
                createProviderProxyPrototype({});
            }).toThrowError('no providers object passed.');
        });
    });

    describe('provider proxy', proxy_provider_spec);

    describe('provider builder', provider_builder_spec);

    describe('base provider', base_provider_spec);

    describe('transient provider', transient_provider_spec);

    describe('singleton provider', singleton_provider_spec);

    describe('state provider', state_provider_spec);

    describe('root provider', root_provider_spec);

    describe('parent provider', parent_provider_spec);
}
