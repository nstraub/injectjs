/*global expect*/
/*global ProviderBuilder*/
/*global stores*/
/*global it*/
/*global InjectJS*/

var resolve_method_spec = function () {
    "use strict";

    it("should register a new provider proxy in the providers store", function () {
        InjectJS.resolve('test');

        expect(stores.providers.test).toBeInstanceOf(ProviderBuilder);
    });
    it("should return registered provider proxy", function () {
        var provider = InjectJS.resolve('test');

        expect(stores.providers.test).toBe(provider);
    });
    it("should throw an error if no dependency name is passed", function () {
        expect(function () { InjectJS.resolve(); }).toThrowError("you must supply a name for your dependency");
    });
    it("should replace an existing dependency provider with a new one if the same name is passed", function () {
        var provider = InjectJS.resolve('test');

        expect(InjectJS.resolve('test')).not.toBe(provider);
    });
};