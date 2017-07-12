/*global describe*/
/*global it*/
/*global expect*/
export default function () {


    describe("$get method", function () {
        it("should _instantiate dependency if not present in state store");
        it("should return a proxy for dependency that points to the current dependency in state store");
        it("should create proxy for dependency if not present in state proxies store");
        it("should throw an error if _assert_usable fails and there is no _proxy specified");
    });

    describe("_create_proxy method", function () {
        it("should define proxy functions for methods on the dependency");
        it("should define proxy getter and setter for read/write properties");
        it("should define proxy getter for read-only properties");
        it("should correctly configure descriptor flags");
    });

    describe("_assert_usable method", function () {
        it("should throw an error if `Object.defineProperty` isn't supported");
        it("should throw an error if `Object.getOwnPropertyDescriptor` isn't supported");
        it("should cache its response");
    });
};