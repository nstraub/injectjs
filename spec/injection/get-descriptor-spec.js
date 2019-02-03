import getDescriptor            from '../../src/injection/get-descriptor';
import testFaker, {harnessedIt} from '../_common/testable-js';

export default function () {
    const hit = harnessedIt(it);

    beforeAll(function () {
        testFaker.setActiveFakes(['buildAnonymousDescriptor']);
    });
    let stores;
    beforeEach(function () {
        testFaker.activateFakes();
        stores = {
            providers: {},
            types: {},
            fakes: {}
        };
    });
    afterEach(testFaker.restoreFakes);

    it('should be able to return a provider descriptor', function () {
        stores.providers.test = 'test descriptor';
        expect(getDescriptor(stores, 'test')).toBe('test descriptor');
    });
    it('should be able to return a type descriptor', function () {
        stores.types.test = 'test descriptor';
        expect(getDescriptor(stores, 'test')).toBe('test descriptor');
    });
    it('should be able to return a fake descriptor', function () {
        stores.fakes.test = 'test descriptor';
        expect(getDescriptor(stores, 'test')).toBe('test descriptor');
    });
    it('should prioritize types over providers', function () {
        stores.types.test = 'test descriptor';
        stores.providers.test = 'test provider';
        expect(getDescriptor(stores, 'test')).toBe('test descriptor');
    });
    it('should prioritize fakes over providers', function () {
        stores.fakes.test = 'test descriptor';
        stores.providers.test = 'test provider';
        expect(getDescriptor(stores, 'test')).toBe('test descriptor');
    });
    it('should prioritize fakes over types', function () {
        stores.fakes.test = 'test descriptor';
        stores.types.test = 'test type';
        expect(getDescriptor(stores, 'test')).toBe('test descriptor');
    });
    it('should return an empty object if no name passed', function () {
        stores.types.test = 'test descriptor';
        stores.providers.test = 'test provider';
        expect(getDescriptor(stores)).toEqual({});
    });
    hit('should build an anonymous descriptor if not present in stores', function (badStub) {
        getDescriptor(stores, ['test', function () {}]);
        expect(badStub).toHaveBeenCalledOnce();
    }, 'buildAnonymousDescriptor');
}
