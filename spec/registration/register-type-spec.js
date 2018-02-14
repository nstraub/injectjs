import registerType from 'registration/register-type';


export default function () {
    let typeFn = function () {
        },
        props;

    beforeEach(function () {
        props = {
            DEFAULT_LIFETIME: 'transient',
            cache: {},
            types: {}
        };
    });

    it('should throw an exception when asked to create a singleton type which is already instantiated', function () {
        props.cache.test = {};
        expect(() => registerType(props, 'test', typeFn, 'singleton'))
            .toThrow('you cannot re-register a singleton that has already been instantiated');
    });
}
