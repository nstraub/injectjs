import autoStub      from '../_common/auto-stub';
import buildProvider from 'providers/build-provider';


const stubber = autoStub();

stubber.addStubDirective('provideTransientModule');
stubber.addStubDirective('provideCachedModule');
stubber.addStubDirective('provideProviderModule');
stubber.addStubDirective('provideParentModule');
stubber.addStubDirective('provideRootModule');

export default function () {
    beforeEach(stubber.stub);
    afterEach(stubber.unstub);

    [
        ['transient', 'provideTransient'], ['singleton', 'provideCached'],
        ['parent', 'provideParent'], ['root', 'provideRoot']
    ].forEach(function ([when, what]) {
        it(`should call ${what} when descriptor lifetime is ${when}`, function () {
            buildProvider({}, {lifetime: when});

            expect(stubber.get(`${what}Module::default`))
                .toHaveBeenCalledOnce();
        });
    });

    it('should call provideProvider when descriptor has no lifetime', function () {
        buildProvider({}, {});

        expect(stubber.get('provideProviderModule::default'))
            .toHaveBeenCalledOnce();
    });

    it('should cache providers for named types', function () {
        let store = {
            cache: {}
        };

        stubber.get('provideRootModule::default').returns({name: 'test'});
        buildProvider(store, {name: 'test', lifetime: 'root'});

        expect(store.cache.test).not.toBeUndefined();
    });
}
