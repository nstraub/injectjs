import injector from '../instantiate.injector';
export default function() {
    beforeEach(() =>
        injector.fakes = {
            test_fake: {
                type() {},
                lifetime: 'singleton'
            },
            test_fake_two: {
                type() {},
                lifetime: 'transient'
            }
        }
    );

    return it('removes all registered fakes', function() {
        injector.flushFakes();

        return expect(injector.fakes).toEqual({});
});
};
