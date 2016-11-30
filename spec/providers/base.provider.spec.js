/*global describe*/
/*global it*/
/*global expect*/
"use strict";
var base_provider_spec = function () {
    describe("_instantiate method", function () {
        it("should create a new instance of the dependency when constructor or prototype registered", function () { return; });
        it("should throw an error if provider registered", function () { return; });
        it("should run _post_provider if registered", function () { return; });
        it("should assert all static dependencies exist", function () { return; });
        it("should assert circular references for non-checked static dependencies", function () { return; });
        it("should assert all ad-hoc dependencies were passed in the adhoc_dependencies argument", function () { return; });
        it("should $get all required dependencies for graph", function () { return; });
        it("should pass in adhoc parameter when building graph", function () { return; });
    });
};