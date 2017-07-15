/*global describe*/
/*global it*/
/*global expect*/

import {providers} from '../util/setup.teardown';

export default function () {
    describe("_instantiate method", function () {
        it("should create a new instance of the dependency when constructor or prototype registered", function () {
            providers.base
        });
        it("should throw an error if provider registered");
        it("should run _post_provider if registered");
        it("should assert all static dependencies exist");
        it("should assert circular references for non-checked static dependencies");
        it("should assert all ad-hoc dependencies were passed in the adhoc_dependencies argument");
        it("should $get all required dependencies for graph");
        it("should pass in adhoc parameter when building graph");
    });
};