import testFaker      from '../_common/testable-js';
import buildProvider from 'providers/build-provider';



export default function () {
    beforeAll(function () {
        testFaker.setActiveFakes(['provideTransient', 'provideCached', 'provideProvider', 'provideParent', 'provideRoot']);
    });
    beforeEach(testFaker.activateFakes);
    afterEach(testFaker.restoreFakes);

    [
        ['transient', 'provideTransient'], ['singleton', 'provideCached'],
        ['parent', 'provideParent'], ['root', 'provideRoot']
    ].forEach(function ([when, what]) {
        it(`should call ${what} when descriptor lifetime is ${when}`, testFaker.harness(function (provider) {
            buildProvider({}, {lifetime: when});

            expect(provider).toHaveBeenCalledOnce();
        }, what));
    });

    it('should call provideProvider when descriptor has no lifetime', testFaker.harness(function (provider) {
        buildProvider({}, {});

        expect(provider).toHaveBeenCalledOnce();
    }, 'provideProvider'));

    it('should cache providers for named types', testFaker.harness(function (provideRoot) {
        let store = {
            cache: {}
        };

        provideRoot.returns({name: 'test'});
        buildProvider(store, {name: 'test', lifetime: 'root'});

        expect(store.cache.test).not.toBeUndefined();
    }, 'provideRoot'));
}
