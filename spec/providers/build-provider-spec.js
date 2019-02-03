import testFaker, {harnessedIt} from '../_common/testable-js';
import buildProvider            from 'providers/build-provider';



export default function () {
    const hit = harnessedIt(it);

    beforeAll(function () {
        testFaker.setActiveFakes(['provideTransient', 'provideCached', 'provideProvider', 'provideParent', 'provideRoot']);
    });
    beforeEach(testFaker.activateFakes);
    afterEach(testFaker.restoreFakes);

    [
        ['transient', 'provideTransient'], ['singleton', 'provideCached'],
        ['parent', 'provideParent'], ['root', 'provideRoot']
    ].forEach(function ([when, what]) {
        hit(`should call ${what} when descriptor lifetime is ${when}`, function (provider) {
            buildProvider({}, {lifetime: when});

            expect(provider).toHaveBeenCalledOnce();
        }, what);
    });

    hit('should call provideProvider when descriptor has no lifetime', function (provider) {
        buildProvider({}, {});

        expect(provider).toHaveBeenCalledOnce();
    }, 'provideProvider');

    hit('should cache providers for named types', function (provideRoot) {
        let store = {
            cache: {}
        };

        provideRoot.returns({name: 'test'});
        buildProvider(store, {name: 'test', lifetime: 'root'});

        expect(store.cache.test).not.toBeUndefined();
    }, 'provideRoot');
}
