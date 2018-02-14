import assertLifetime from 'registration/assert-lifetime';

export default function () {
    it('should not throw any exceptions if passed a valid lifetime', function () {
        expect(() => assertLifetime('singleton')).not.toThrow();
        expect(() => assertLifetime('transient')).not.toThrow();
        expect(() => assertLifetime('root')).not.toThrow();
        expect(() => assertLifetime('parent')).not.toThrow();
        expect(() => assertLifetime('state')).not.toThrow();
    });

    it('should throw an exception if passed an invalid lifetime', function () {
        expect(() => assertLifetime('invalid')).toThrow('invalid lifetime "invalid" provided. Valid lifetimes are singleton, transient, instance and parent');
    });
}
