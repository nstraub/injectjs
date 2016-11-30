describe("InjectJS", function () {
    beforeAll(global_setup);
    afterEach(local_teardown);

    describe("Main Module", InjectJS_spec);
    describe("Poviders", providers_spec);
});