import autoStub from '../_common/auto-stub';
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

    it('should call provideProvider when descriptor has no lifetime', function () {
        buildProvider({}, {});

        expect(stubber.get('provideProviderModule::default')).toHaveBeenCalledOnce();
    });
    it('should call provideTransient when descriptor lifetime is transient', function () {
        buildProvider({}, {lifetime: 'transient'});

        expect(stubber.get('provideTransientModule::default')).toHaveBeenCalledOnce();
    });
    it('should call provideCached when descriptor lifetime is state', function () {
        buildProvider({}, {lifetime: 'state'});

        expect(stubber.get('provideCachedModule::default')).toHaveBeenCalledOnce();
    });
    it('should call provideCached when descriptor lifetime is singleton', function () {
        buildProvider({}, {lifetime: 'singleton'});

        expect(stubber.get('provideCachedModule::default')).toHaveBeenCalledOnce();
    });
    it('should call provideParent when descriptor lifetime is parent', function () {
        buildProvider({}, {lifetime: 'parent'});

        expect(stubber.get('provideParentModule::default')).toHaveBeenCalledOnce();
    });
    it('should call provideRoot when descriptor lifetime is root', function () {
        buildProvider({}, {lifetime: 'root'});

        expect(stubber.get('provideRootModule::default')).toHaveBeenCalledOnce();
    });

    it('should cache providers for named types', function () {
        let store = {
            cache: {}
        };

        stubber.get('provideRootModule::default').returns({name:'test'});
        buildProvider(store, {name: 'test', lifetime: 'root'});

        expect(store.cache.test).not.toBeUndefined();
    });
}
