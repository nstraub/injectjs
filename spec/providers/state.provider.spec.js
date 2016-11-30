/*global describe*/
/*global it*/
/*global expect*/
var state_provider_spec = function () {
    "use strict";

    describe("$get method", function () {
        it("should _instantiate dependency if not present in state store", function () { return; });
        it("should return a proxy for dependency that points to the current dependency in state store", function () { return; });
        it("should create proxy for dependency if not present in state proxies store", function () { return; });
        it("should throw an error if _assert_usable fails and there is no _proxy specified");
    });

    describe("_create_proxy method", function () {
        it("should define proxy functions for methods on the dependency", function () { return; });
        it("should define proxy getter and setter for read/write properties", function () { return; });
        it("should define proxy getter for read-only properties", function () { return; });
        it("should correctly configure descriptor flags", function () { return; });
    });

    describe("_assert_usable method", function () {
        it("should throw an error if `Object.defineProperty` isn't supported", function () { return; });
        it("should throw an error if `Object.getOwnPropertyDescriptor` isn't supported", function () { return; });
        it("should cache its response", function () { return; });
    });
};