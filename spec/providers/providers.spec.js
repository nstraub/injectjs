/*global describe*/
/*global it*/
/*global expect*/
/*global createProviderProxyPrototype*/
/*global proxy_provider_spec*/
/*global provider_builder_spec*/
/*global base_provider_spec*/
/*global transient_provider_spec*/
/*global singleton_provider_spec*/
/*global state_provider_spec*/
/*global root_provider_spec*/
/*global parent_provider_spec*/
"use strict";
var providers_spec = function () {
    describe("provider proxy prototype factory", function () {
        it("should throw an error when no stores object is passed", function () {
            expect(function () { createProviderProxyPrototype(); }).toThrowError("no stores object passed.");
        });
        it("should throw an error when no providers object is passed", function () {
            expect(function () { createProviderProxyPrototype({}); }).toThrowError("no providers object passed.");
        });
    });

    describe("provider proxy", proxy_provider_spec);

    describe("provider builder", provider_builder_spec);

    describe("base provider", base_provider_spec);

    describe("transient provider", transient_provider_spec);

    describe("singleton provider", singleton_provider_spec);

    describe("state provider", state_provider_spec);

    describe("root provider", root_provider_spec);

    describe("parent provider", parent_provider_spec);
};