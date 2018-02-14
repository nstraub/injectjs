import clearState from 'util/clear-state';


export default function () {
    it('clears state specs from cache', function () {
        const stores = {
            cache: {
                s1: {},
                s2: {},
                s3: {},
                s4: {},
                s5: {}
            },
            state: {
                s1: {},
                s2: {},
                s3: {},
                s4: {},
                s5: {},
                s6: {}
            }
        };

        clearState(stores);

        expect(stores.cache).toEqual({});
        expect(stores.state).toEqual({});
    });
}
